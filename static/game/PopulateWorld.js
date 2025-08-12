export class PopulateWorld {

  constructor(tileService, localObjects) {
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
