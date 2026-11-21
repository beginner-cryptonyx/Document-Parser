import cv2 as cv
import numpy as np
from pathlib import Path
import json
from docling_core.types.doc.base import BoundingBox


class ImageProcessor:
    def __init__(self, sessionID: str, filename:str, folder_path: Path, json_path: Path ):
        self.sessionID = sessionID
        self.filename = filename
        self.folder_path = folder_path
        self.json_path = json_path
        
    def process_image(self):
        img = cv.imread(str(self.folder_path / self.filename))
        if img is None:
            raise FileNotFoundError(f"Could not load image at: {self.folder_path / self.filename}")

        with open(self.json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            for element in data["texts"]:
                bbox = BoundingBox.model_validate(element["prov"][0]["bbox"])

                cv.rectangle(
                    img,
                    (int(bbox.l), int(bbox.t)),
                    (int(bbox.r), int(bbox.b)),
                    (0, 255, 0),
                    2,
                )
        cv.imwrite(str(self.folder_path / "processed_image.jpg"), img)
