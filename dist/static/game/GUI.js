import { G } from '/static/engine/G.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Html } from '/static/engine/html/Html.js'; 


const MIN_MONEY_TO_BUY = 11;

export class GUI {
  constructor( onBuyTurret ) {

				AssertNotNull(onBuyTurret, "argument onBuyTurret in " + this.constructor.name + ".js should not be null")
			
		this.onBuyTurret = onBuyTurret; 

    this.buyTurretBtn = Html.button('Buy Turret', onBuyTurret);
    Html.upper([this.buyTurretBtn]);

    this.moneyLabel = Html.p(G.money);
    Html.upperLeft([this.moneyLabel]);

    this.update(); 
  }

  update() {
    Html.changeText(this.moneyLabel, G.money);
    (G.money >= MIN_MONEY_TO_BUY)
      ? Html.enable(this.buyTurretBtn)
      : Html.disable(this.buyTurretBtn);
  }

  destroy() {
    try { Html.remove?.(this.buyTurretBtn); } catch {}
    try { Html.remove?.(this.moneyLabel); } catch {}
  }
}
