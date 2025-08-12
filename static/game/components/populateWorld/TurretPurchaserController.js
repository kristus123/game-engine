
export class TurretPurchaserController {
  constructor(localObject) {
    this.localObject = localObject
   
  }

  enablePurchase(name) {
     return Html.button(name, () => {
          Mouse.onClick = p => {
            this.localObject.add(new Turret(p.copy()))
            Audio.click()

            if (new Square(p, 10).touchesAny(this.walkableTiles.filter(t => t.i == 1).map(t => t.position))) {
              this.localObject.add(new Turret(p.copy()))
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
