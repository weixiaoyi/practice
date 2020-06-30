export default class Base {
  constructor(options = {}) {
    const { width, height, position, style } = options;
    this.width = width;
    this.height = height;
    this.position = position;
    this.style = style;
  }
}
