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
<<<<<<< HEAD
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
||||||| parent of 238d9b4 (x)


		Html.upper([
			this.buyTurret = Html.button('buy turret', () => {
				Mouse.onClick = p => {
					tla(new Turret(p.copy()))
					Audio.click()

					if (new Square(p, 10).touchesAny(this.walkableTiles.filter(t => t.i == 1).map(t => t.position))) {
						tla(new Turret(p.copy()))
						Audio.click()
						Mouse.onClick = null
					}
				}
			}),
||||||| parent of 321787c (x)
=======
			new BottomText([
				"when life is hard, just remember",
				"It will get harder",
				"It will get so hard that you will cry",
				"That is a small step towards your next part in life",
				"So when you are about to cry....",
			]),
>>>>>>> 321787c (x)
		])
=======
		Html.upper([
			this.buyTurret = Html.button('buy turret', () => {
				Mouse.onClick = p => {
					if (new Square(p, 10).touchesAny(this.walkableTiles.filter(t => t.i == 1).map(t => t.position))) {
						tla(new Turret(p.copy()))
						Sound.click()
						Mouse.onClick = null
					}
				}
			}),
		])
>>>>>>> 238d9b4 (x)

<<<<<<< HEAD
  draw(draw, guiDraw) {
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
}