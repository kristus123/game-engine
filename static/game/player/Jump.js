export class Jump {
	constructor(player, onArrival = (p) => {}) {
		this.localObjects = new LocalObjects([
			OnTrue(() => Keyboard.q && !this.destination && !this.maxDistance , () => {

				const destination = Mouse.position.copy()
				const distance = Distance.between(this.player, destination)

				if (distance > 800) {
					this.maxDistance = distance
					this.destination = destination
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
			ForcePush(this.player).towards(this.destination, 400)

			if (this.player.touches(this.destination) && this.scale < 2) {
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
