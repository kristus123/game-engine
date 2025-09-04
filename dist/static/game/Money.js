import { Html } from '/static/engine/html/Html.js'; 

export class Money {
	static init() {
		this.amount = 100

		Html.upperRight([
			this.money = Html.p(this.amount),
		])

		return this
	}

	static update() {
	}

	static draw(draw) {
	}

	static increase(amount) {
		this.amount += amount
		this.updateUi()
	}

	static subtract(amount) {
		this.amount -= amount
		this.updateUi()
	}

	static moreThan(amount) {
		return this.amount >= amount
	}

	static lessThan(amount) {
		return this.amount <= amount
	}

	static updateUi() {
		Html.changeText(this.money, this.amount)
	}
}
