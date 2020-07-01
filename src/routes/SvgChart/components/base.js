import { v4 as uuidv4 } from "uuid";

export default class Base {
  constructor(options = {}) {
    const { type, width, height, position, style } = options;
    this.uuid = uuidv4();
    this.type = type;
    this.width = width;
    this.height = height;
    this.position = position;
    this.style = style;
    this.zoomControlVertex = {
      width: 8,
      height: 8,
      coordinates: [],
    }; // 控制点
    this.rotateControlVertex = {
      radius: 2,
      coordinates: [],
    }; // 旋转点
    this.edgeCentreVertex = {
      radius: 2,
      coordinates: [],
    }; // 边缘中心点
    this.init();
  }

  init = () => {
    this.generateZoomControlVertex();
  };

  _helperGetAbsoluteCoordinate = (coordinate = []) => {
    const position = this.position;
    return coordinate.map((item) => [
      position.x + item[0],
      position.y + item[1],
    ]);
  };

  generateZoomControlVertex = (pointNum = 4) => {
    const { width, height } = this;
    this.zoomControlVertex.coordinates = this._helperGetAbsoluteCoordinate([
      [0, 0],
      [width, 0],
      [width, height],
      [0, height],
    ]);
  };

  generateRotateControlVertex = () => {};

  generateEdgeCentreVertex = () => {};

  update = () => {
    this.init();
    return { ...this };
  };
}
