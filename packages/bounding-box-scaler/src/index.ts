export interface BoundingBoxXYWH {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ScaleConfig {
  srcWidth: number;
  srcHeight: number;
  destWidth: number;
  destHeight: number;
}

export function scaleBox(box: BoundingBoxXYWH, config: ScaleConfig): BoundingBoxXYWH {
  const scaleX = config.destWidth / config.srcWidth;
  const scaleY = config.destHeight / config.srcHeight;

  return {
    x: Math.round(box.x * scaleX),
    y: Math.round(box.y * scaleY),
    width: Math.round(box.width * scaleX),
    height: Math.round(box.height * scaleY)
  };
}

export function boxToXYWH(xyxy: [number, number, number, number]): BoundingBoxXYWH {
  const [x1, y1, x2, y2] = xyxy;
  return {
    x: x1,
    y: y1,
    width: x2 - x1,
    height: y2 - y1
  };
}

export function boxToXYXY(box: BoundingBoxXYWH): [number, number, number, number] {
  return [box.x, box.y, box.x + box.width, box.y + box.height];
}
