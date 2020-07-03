import { v4 as uuidv4 } from "uuid";

export default class Base {
  constructor(options = {}) {
    const { type, size, position, style } = options;
    this.id = uuidv4();
    this.type = type;
    this.size = size;
    this.position = position;
    this.style = style;
    this.zoomControlVertex = []; // 控制点
    this.rotateControlVertex = []; // 旋转点
    this.edgeCentreVertex = []; // 边缘中心点
  }

  init = () => {
    this.generateZoomControlVertex();
    this.generateEdgeCentreVertex();
  };

  _helperGetAbsoluteCoordinate = (coordinate = []) => {
    const position = this.position;
    return coordinate.map(([pointX, pointY]) => [
      position.x + pointX,
      position.y + pointY,
    ]);
  };

  generateZoomControlVertex = () => {
    const { width, height } = this.size;
    this.zoomControlVertex = this._helperGetAbsoluteCoordinate([
      [0, 0],
      [width, 0],
      [width, height],
      [0, height],
    ]);
  };

  generateRotateControlVertex = () => {};

  generateEdgeCentreVertex = () =>
    throw new Error("generateEdgeCentreVertex method must to be implement!");

  update = (keys, values) => {
    if (typeof keys === "object") {
      Object.entries(keys).forEach(([key, value]) => (this[key] = value));
    } else {
      this[keys] = values;
    }

    this.init();
    return this;
  };
}
