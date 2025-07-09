import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class Charge {
	constructor(chargePerUpdate, maxCharge) {

				AssertNotNull(chargePerUpdate, "argument chargePerUpdate in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(maxCharge, "argument maxCharge in " + this.constructor.name + ".js should not be null")
			
		this.chargePerUpdate = chargePerUpdate; 
		this.maxCharge = maxCharge; 

		this.charge = maxCharge


		this.onExhaust = () => {}

		this.onReady = () => {}
		this.onReadyTriggered = false
	}

	ready() {
		return this.charge >= this.maxCharge
	}

	exhaust() {
		this.charge = 0
		this.onExhaust()
		console.log('triggered on exhaust')

		this.onReadyTriggered = false
	}

	update() {
		this.charge += this.chargePerUpdate

		if (this.ready() && !this.onReadyTriggered) {
			this.onReady()
			this.onReadyTriggered = true
			console.log('triggered on ready')
		}
	}

	draw(draw, guiDraw) {
	}
}
