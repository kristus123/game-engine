import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Position } from '/static/engine/position/Position.js'; 


export class WalkableTileService {
  constructor(width, height, scale) {

				AssertNotNull(width, "argument width in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(height, "argument height in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(scale, "argument scale in " + this.constructor.name + ".js should not be null")
			
		this.width = width; 
		this.height = height; 
		this.scale = scale; 

    this.width = width;
    this.height = height;
    this.scale = scale;
    this.walkableTiles = [];
  }

  setTiles(tiles) {
    this.walkableTiles = tiles.map(e => ({
      i: e.i,
      position: new Position(
        e.x * this.scale * this.width,
        e.y * this.scale * this.height,
        this.width * this.scale,
        this.height * this.scale
      )
    }));
  }

  getTilesByType(type) {
    return this.walkableTiles.filter(t => t.i === type).map(t => t.position);
  }
}
