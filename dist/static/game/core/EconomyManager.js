import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { EventBus } from '/static/game/utils/EventBus.js'; 

export class EconomyManager {
	constructor(initial = 0) {

				AssertNotNull(initial, "argument initial in " + this.constructor.name + ".js should not be null")
			
		this.initial = initial; 

		this._money = initial|0
		this.events = new EventBus()
	}

	get money() {
		return this._money
	}

	setMoney(value) {
		this._money = (value|0)
		this.events.emit('change', this._money)
	}

	add(amount) {
		this.setMoney(this._money + (amount|0))
	}

	canSpend(amount) {
		return this._money >= amount
	}

	trySpend(amount) {
		if (!this.canSpend(amount)) {
			return false
		}
		this.setMoney(this._money - (amount|0))
		return true
	}
}
