export class Jump {
	constructor(player, onArrival = (p) => {}) {
		this.localObjects = new LocalObjects([
			OnTrue(() => Keyboard.q && !this.destination && !this.maxDistance, () => {
				this.destination = Mouse.position.copy()
				this.maxDistance = Distance.between(player, this.destination)
			}),
		])
	}

	get scale() {
		console.log(this.maxDistance)
		if (this.destination && this.maxDistance) {
			const x =  Normalize(Distance.between(this.player, this.destination), this.maxDistance)
			return Math.min(x, 5)
		}
		else {
			return 1
		}
	}

	update() {
		if (this.destination && !this.arrived) {
			ForcePush(this.player).towards(this.destination, 10)

			if (this.player.within(70, this.destination) && this.scale < 2) {
				this.onArrival(this.destination)

				this.destination = null
				this.maxDistance = null
			}
		}

		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
