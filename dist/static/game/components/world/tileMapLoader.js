import { Http } from '/static/engine/http/Http.js'; 
import { StaticHttp } from '/static/engine/http/StaticHttp.js'; 

/**
 * Service for loading and parsing tilemap data from a given URL.
 *  Uses StaticHttp to retrieve JSON data describing the world layout.
 * */ 
export class TileMapLoader {
  constructor() {


  }

  load(url) {
    const json = StaticHttp.get(url);
    const tilemap = json.tilemaps[0];
    return { width: tilemap.width, height: tilemap.height, tiles: tilemap.tiles };
  }
}
