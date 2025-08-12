import { G } from '/static/engine/G.js'; 
import { a } from '/static/engine/a.js'; 
<<<<<<< HEAD
||||||| parent of 238d9b4 (x)
import { Audio } from '/static/engine/audio/Audio.js'; 
=======
import { Sound } from '/static/engine/audio/Sound.js'; 
>>>>>>> 238d9b4 (x)
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

<<<<<<< HEAD
    this.localObjects = new LocalObjects([
||||||| parent of 238d9b4 (x)

		this.walkableTiles = []
		for (const e of this.jsonFile.tilemaps[0].tiles) {
			this.walkableTiles.push({
				i: e.i,
				position: new Position(
					(e.x * scale * this.width),
					(e.y * scale * this.height),
					this.width * scale,
					this.height * scale,
				)
			})
		}

		this.localObjects = new LocalObjects([
=======
		this.walkableTiles = []
		for (const e of this.jsonFile.tilemaps[0].tiles) {
			this.walkableTiles.push({
				i: e.i,
				position: new Position(
					(e.x * scale * this.width),
					(e.y * scale * this.height),
					this.width * scale,
					this.height * scale,
				)
			})
		}

		this.localObjects = new LocalObjects([
>>>>>>> 238d9b4 (x)
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

<<<<<<< HEAD
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
||||||| parent of 238d9b4 (x)


		Html.upper([
			this.buyTurret = Html.button('buy turret', () => {
				Mouse.onClick = p => {
					this.localObjects.add(new Turret(p.copy()))
					Audio.click()

					if (new Square(p, 10).touchesAny(this.walkableTiles.filter(t => t.i == 1).map(t => t.position))) {
						this.localObjects.add(new Turret(p.copy()))
						Audio.click()
						Mouse.onClick = null
					}
				}
			}),
		])
=======
		Html.upper([
			this.buyTurret = Html.button('buy turret', () => {
				Mouse.onClick = p => {
					if (new Square(p, 10).touchesAny(this.walkableTiles.filter(t => t.i == 1).map(t => t.position))) {
						this.localObjects.add(new Turret(p.copy()))
						Sound.click()
						Mouse.onClick = null
					}
				}
			}),
		])
>>>>>>> 238d9b4 (x)

<<<<<<< HEAD
    this.localObjects.draw(draw, guiDraw);
||||||| parent of eb55a75 (x)
		Html.upperLeft([
			this.money = Html.p(G.money),
		])
	}
=======
		Html.upperRight([
			this.money = Html.p(G.money),
		])
	}
>>>>>>> eb55a75 (x)

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
}
