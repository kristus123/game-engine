import { Distance } from '/static/engine/Distance.js'; 
import { Normalize } from '/static/engine/animation/Normalize.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { Keyboard } from '/static/engine/controller/keyboard/Keyboard.js'; 
import { Html } from '/static/engine/html/Html.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { OnTrue } from '/static/engine/on/OnTrue.js'; 

export class Jump {
	constructor(player, onArrival = (p) => {}) {

				AssertNotNull(player, "argument player in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(onArrival, "argument onArrival in " + this.constructor.name + ".js should not be null")
			
		this.player = player; 
		this.onArrival = onArrival; 

		this.localObjects = new LocalObjects([
			new OnTrue(() => Keyboard.q && !this.destination && !this.maxDistance, () => {

				const destination = Mouse.position.copy()
				const distance = Distance.between(this.player, destination)

				if (distance > 800) {
					this.maxDistance = distance
					this.destination = destination
				}
				else {
					Html.fadeaway('You need to jump further away', player)
				}
			}),
		])
	}

	get scale() {
		if (this.destination && this.maxDistance) {
			const x = Normalize(Distance.between(this.player, this.destination), this.maxDistance)
			return Math.min(x, 5)
		}
		else {
			return 1
		}
	}

	update() {
		if (this.destination && !this.arrived) {
			this.player.forcePushTowards(this.destination, 400)

			if (this.player.touches(this.destination) && this.scale < 2) {
				this.onArrival(this.destination)

				this.destination = null
				this.maxDistance = null
			}
		}

		this.localObjects.update()
	}

	draw(draw) {
		this.localObjects.draw(draw)
	}
}
