import { Audio } from '/static/engine/audio/Audio.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { Square } from '/static/engine/graphics/Square.js'; 
import { Html } from '/static/engine/html/Html.js'; 
import { Turret } from '/static/game/Turret.js'; 

export class TurretPurchaserController {
  constructor() {


   
  }

  enablePurchase(name) {
      Html.button(name, () => {
          Mouse.onClick = p => {
            this.localObjects.add(new Turret(p.copy()))
               Audio.click()

            if (new Square(p, 10).touchesAny(this.walkableTiles.filter(t => t.i == 1).map(t => t.position))) {
              this.localObjects.add(new Turret(p.copy()))
              Audio.click()
              Mouse.onClick = null
            }
          }
      })
  }

  isValidPlacement(position) {
    return new Square(position, 10)
      .touchesAny(this.tileService.getTilesByType(1));
  }
}
