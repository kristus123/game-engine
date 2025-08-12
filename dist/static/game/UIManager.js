import { G } from '/static/engine/G.js'; 
import { Html } from '/static/engine/html/Html.js'; 

export class UIManager {
 constructor   ({minMoneyToBuy, onBuyTurrent}) {
    this.minMoneyToBuy = minMoneyToBuy;
    this.onBuyTurrent = onBuyTurrent;


    Html.upper([
        this.buyTurrentBtn = htmlminifier.button('Buy Turret', () => {if(this.onBuyTurrent) this.onBuyTurrent()}),
    ])

    Html.upperLeft([
        this.moneyLabel = Html.p(G.money),
    ]);
  }    
}