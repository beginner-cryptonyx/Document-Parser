type fileUploadStatus = "idle"|"selected"|"success"|"error"|"uploading"

export type Block = {
  id: string;
  text: string;      // current, editable
  original: string;  // OCR output, never mutated
  t: number; l: number; r: number; b: number; // normalized 0..1, top-left origin
  confidence?: number;
};


export type {fileUploadStatus   }