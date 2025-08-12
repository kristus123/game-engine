export class MonsterSpawner {

  constructor(tileService, localObjects, interval = 200) {
    this.tileService = tileService;
    this.localObjects = localObjects
    this.interval = interval;
    
  }

  start(type) {
    setInterval(() => {
      const spawnPositions = this.tileService.getTilesByType(type);
      this.localObjects.add(new Monster(spawnPositions))  
    }, this.interval);
  }
}
