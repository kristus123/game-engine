import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Monster } from '/static/game/Monster.js'; 


/**
 * Handles periodic spawning of monsters based on available tile positions.
 */
export class MonsterSpawner {

  constructor(tileService, interval = 200) {

				AssertNotNull(tileService, "argument tileService in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(interval, "argument interval in " + this.constructor.name + ".js should not be null")
			
		this.tileService = tileService; 
		this.interval = interval; 

    this.tileService = tileService;
    this.interval = interval;
  }

  start(type) {
    setInterval(() => {
      const spawnPositions = this.tileService.getTilesByType(type);
      this.localObjects.add(new Monster(spawnPositions))
    }, this.interval);
  }
}
