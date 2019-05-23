class Star {
  constructor(x, y) {
    this.id = generateUUID();
    this.name = generateStarName();
    this.selected = false;
    this.x = x;
    this.y = y;
    this.message = new Text(this.name, textStyle);
  }
}
