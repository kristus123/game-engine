
const SCALE = 8;
const SPAWN_INTERVAL_MS = 2000;
const PREVIEW_SIZE = 100;
const PLACE_RADIUS = 10;

const PRICEBOOK_BASE = {
  turret: 20,
  upgrade1: 15,
};

export class World {
  constructor() {
    Camera.followInstantly(new Position(500, 500));

    this.map = new MapLoader('/static/assets/aseprite/world_tilemaps.json', SCALE).load();

    this.localObjects = new LocalObjects([this.map.background]);

    this.economy = new EconomyManager(20);
    EconomyToGlobal(this.economy);
    this.shop = new ShopManager(this.economy, PRICEBOOK_BASE, {
      canPlaceAt: (p) => new Square(p, PLACE_RADIUS).touchesAny(this.map.buildTiles),
      placeTurret: (p) => tla(new Turret(p)),
      mount: 'upper',
      previewSize: PREVIEW_SIZE,
    });
    
    this.gui = new GUI(this.economy);
    
    this.spawner = new Spawner(	() => new Monster(this.map.pathTiles), SPAWN_INTERVAL_MS, (e) => tla(e));
	  this.spawner.start();

  }

  buildWalkableTiles(tiles) {
    const tw = this.map.width  * SCALE;
    const th = this.map.height * SCALE;

    return tiles.map(e => ({
      i: e.i,
      position: new Position(e.x * tw, e.y * th, tw, th),
    }));
  }


  destroy() {
    if (this.spawnTimer) {
      clearInterval(this.spawnTimer);
      this.spawnTimer = null;
    }
  }

  update() {
    this.localObjects.update();
  }

  draw(draw, guiDraw) {
    this.localObjects.draw(draw, guiDraw);
    this.shop.drawPreview(draw);
  }
}
