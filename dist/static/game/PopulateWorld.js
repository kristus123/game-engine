import { G } from '/static/engine/G.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Controller } from '/static/engine/controller/Controller.js'; 
import { Html } from '/static/engine/html/Html.js'; 
import { Monster } from '/static/game/Monster.js'; 
import { Turret } from '/static/game/Turret.js'; 
import { MonsterSpawner } from '/static/game/components/populateWorld/MonsterSpawner.js'; 
import { TurretPurchaserController } from '/static/game/components/populateWorld/TurretPurchaserController.js'; 

/**
 * Handles adding monsters to the world and creating HTML control buttons.
 */
export class PopulateWorld {

  constructor(tileService, localObjects) {

				AssertNotNull(tileService, "argument tileService in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(localObjects, "argument localObjects in " + this.constructor.name + ".js should not be null")
			
		this.tileService = tileService; 
		this.localObjects = localObjects; 

    this.tileService = tileService;
    this.localObjects = localObjects;
  }

  addMonsters(start){
    new MonsterSpawner(this.tileService,this.localObjects).start(start)
  }

  addTurret(name){
    const turretController = new TurretPurchaserController(this.localObjects);

    Html.upper([
      this.buyTurretButton = turretController.enablePurchase(name)
    ]);

    Html.upperLeft([ this.moneyDisplay = Html.p(G.money) ]);

    Html.changeText(this.moneyDisplay, G.money);
    G.money > 10 ? Html.enable(this.buyTurretButton) : Html.disable(this.buyTurretButton);

  }


}
