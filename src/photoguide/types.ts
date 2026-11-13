export type ShotGroup = 'vin' | 'exterior' | 'wheels' | 'interior' | 'odometer' | 'engine';

/** Local overlay keys. Later the backend serves SVG files instead (overlayUrl in the plan). */
export type OverlayKey =
  | 'front'
  | 'rear'
  | 'side-left'
  | 'side-right'
  | 'q-front-left'
  | 'q-front-right'
  | 'q-rear-left'
  | 'q-rear-right'
  | 'wheel'
  | 'plate'
  | 'cluster';

export type ShotDef = {
  id: string;
  group: ShotGroup;
  label: string;
  hint: string;
  overlay?: OverlayKey;
  required: boolean;
  ocr?: 'vin' | 'odometer';
};

export type Guide = { id: string; version: number; bodyType: string; shots: ShotDef[] };

/** 'file' = real photo on disk (or a data URI on web). 'demo' = built-in sample scene. */
export type PhotoSource = { kind: 'file'; uri: string } | { kind: 'demo'; shotId: string };

export type Photo = {
  id: string;
  shotId: string;
  source: PhotoSource;
  takenAt: string;
};

export type CaptureMode = 'live' | 'demo';

export type SessionResult = {
  guideId: string;
  guideVersion: number;
  mode: CaptureMode;
  photos: Photo[];
};
