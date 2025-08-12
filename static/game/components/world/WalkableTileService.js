/**
 * Manages and processes a collection of walkable tiles in a grid-based environment.
 * Provides functionality to set tile positions (scaled to game/world units) 
 * and retrieve them by type.
 */
export class WalkableTileService {
  
  constructor(width, height, scale) {
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
    return this.walkableTiles
      .filter(t => t.i === type)
      .map(t => t.position);
  }
}
