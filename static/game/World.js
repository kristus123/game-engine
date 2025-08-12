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
}