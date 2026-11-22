type fileUploadStatus = "idle"|"selected"|"success"|"error"|"uploading"

export type Block = {
  id: string;
  text: string;      // current, editable
  original: string;  // OCR output, never mutated
  x: number; y: number; w: number; h: number; // normalized 0..1, top-left origin
  confidence?: number;
};


export type {fileUploadStatus   }