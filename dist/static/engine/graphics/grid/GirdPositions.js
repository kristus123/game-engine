
export class GridPositions {
  constructor() {


    this.grid = new Map();
  }

  set({x, y}, value) {
    if (!this.grid.has(x)) this.grid.set(x, new Map());
    this.grid.get(x).set(y, value);
  }

  get({x, y}) {
    return this.grid.get(x)?.get(y);
  }

	  has({x, y}) {
    return this.grid.get(x)?.has(y) || false;
  }

  remove({x, y}) {
    const col = this.grid.get(x);
    if (!col) return;
    col.delete(y);
    if (col.size === 0) this.grid.delete(x);
  }

	
  forEach() {
    const result = [];
    for (const [x, col] of this.grid) {
      for (const [y, value] of col) {
        result.push([x, y, value]);
      }
    }
    return result;
  }
}

