import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Html } from '/static/engine/html/Html.js'; 

export class GUI {
	constructor(economy) {

				AssertNotNull(economy, "argument economy in " + this.constructor.name + ".js should not be null")
			
		this.economy = economy; 

		this.economy = economy

		this.moneyLabel = Html.p(this.economy.money)
		Html.upperLeft([this.moneyLabel])

		this.unsubMoney = this.economy.events.on('change', (money) => {
			Html.changeText(this.moneyLabel, money)
		})

		this.update()
	}

	update() {
		Html.changeText(this.moneyLabel, this.economy.money)
	}

	destroy() {
		this.unsubMoney?.()
		try {
			Html.remove?.(this.moneyLabel)
		}
		catch {}
	}
}
