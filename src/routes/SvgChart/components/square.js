import Base from "./base";
export default class Square extends Base {
  constructor(props) {
    super(props);
    this.type = "square";
    this.init();
  }

  generateEdgeCentreVertex = () => {
    const { width, height } = this.size;
    this.edgeCentreVertex = this._helperGetAbsoluteCoordinate([
      [width / 2, 0],
      [width, height / 2],
      [width / 2, height],
      [0, height / 2],
    ]);
  };
}
