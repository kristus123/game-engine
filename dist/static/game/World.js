import { G } from '/static/engine/G.js'; 
import { a } from '/static/engine/a.js'; 
import { Camera } from '/static/engine/camera/Camera.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { Square } from '/static/engine/graphics/Square.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { BottomText } from '/static/game/BottomText.js'; 
import { TileMapLoader } from '/static/game/components/world/TileMapLoader.js'; 
import { WalkableTileService } from '/static/game/components/world/WalkableTileService.js'; 

import { BottomText } from '/static/game/BottomText.js'; 
import { Monster } from '/static/game/Monster.js'; 
import { Turret } from '/static/game/Turret.js'; 

const scale = 8;

export class World {
  constructor() {


    Camera.followInstantly(new Position(500, 500));

   
    const loader = new TileMapLoader();
    const { width, height, tiles } = loader.load('/static/assets/aseprite/world_tilemaps.json');
    
    this.tileService = new WalkableTileService(width, height, scale);
    this.tileService.setTiles(tiles);

    this.localObjects = new LocalObjects([
			G.Sprite.world(new Position(0, 0)).idle.show(0),
      new BottomText([
				"when life is hard, just remember",
				"It will get harder",
				"It will get so hard that you will cry",
				"That is a small step towards your next part in life",
				"So when you are about to cry....",
			]),
		]);

    
  }

  update() {
    this.localObjects.update();
  }

  getLocalObjects(){
    return this.localObjects
  }

  getTilesService(){
    return this.tileService
  }

  draw(draw, guiDraw) {

    this.localObjects.draw(draw, guiDraw);

    if (Mouse.onClick) {
        draw.rectangle(new Position(Mouse.position.x, Mouse.position.y, 100, 100))

        if (!new Square(Mouse.position, 10).touchesAny(this.tileService.getTilesByType(1))) {
          draw.color(new Position(Mouse.position.x, Mouse.position.y, 100, 100), 'red')
        }
        else {
          draw.color(new Position(Mouse.position.x, Mouse.position.y, 100, 100), 'green')
        }
    }
  }

