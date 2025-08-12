import { Http } from '/static/engine/http/Http.js'; 
import { StaticHttp } from '/static/engine/http/StaticHttp.js'; 

export class TileMapLoader {
  constructor() {


  }

  load(url) {
    const json = StaticHttp.get(url);
    const tilemap = json.tilemaps[0];
    return { width: tilemap.width, height: tilemap.height, tiles: tilemap.tiles };
  }
}
