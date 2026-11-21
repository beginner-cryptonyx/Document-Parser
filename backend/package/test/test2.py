import cv2 as cv
import numpy as np
from pathlib import Path
import json
from docling_core.types.doc.base import BoundingBox

img_path = Path(__file__).parent / "test1.jpg"

img = cv.imread(str(img_path))
if img is None:
    raise FileNotFoundError(f"Could not load image at: {img_path}")

json_path = Path(__file__).parent / "output.json"

with open(json_path, "r", encoding="utf-8") as f:
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
img = cv.resize(img, (800, 600))
cv.imshow('image', img)
cv.waitKey(0)
