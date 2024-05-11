export class Distance {
  static between(o1, o2) {
    const dx = o2.x - o1.x;
    const dy = o2.y - o1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static withinRadius(o1, o2, radius) {
    return Distance.between(o1, o2) <= radius;
  }

  static compareDistance(p) {
    const objOnCanvas = Http.get("/world-editor")?.objects;
    for (let i = 0; i < objOnCanvas.length; i++) {
      let { position } = JSON.parse(objOnCanvas[i]);
      let obj1 = {
        x: position.x,
        y: position.y,
      };
      let obj2 = { x: p.x, y: p.y };
      if (this.between(obj1, obj2) < p.width) {
        return true;
      }
    }
  }
}
