export type CaptureOptions = {
  firstPixelRatio?: number;
  allowJpegFallback?: boolean;
  allowServerFallback?: boolean;
  serverWidth?: number;
  nonDestructiveFirst?: boolean;
};

export type CaptureResult = {
  dataUrl: string;
  width: number;
  height: number;
  pixelRatio: number;
  format: 'png' | 'jpeg';
};

export type CaptureElementResult = {
  file: File;
  name: string;
  info: string;
};
