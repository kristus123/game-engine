export class Jump extends DynamicGameObject {
	constructor(player, onArrival = (p) => {}) {
		super(player.position) // Initialize base class with player's position
		this.player = player
		this.onArrival = onArrival
		this.destination = null
		this.maxDistance = null
		this.arrived = false

		// Local objects handle extra logic (like keyboard input conditions)
		this.localObjects = new LocalObjects([
			OnTrue(
				// Condition: press Q, no destination set yet
				() => Keyboard.q && !this.destination && !this.maxDistance,
				// Action when condition is true
				() => {
					const destination = Mouse.position.copy()
					const distance = Distance.between(this.player, destination)

					// Only set destination if distance > 800
					if (distance > 800) {
						this.maxDistance = distance
						this.destination = destination
					}
				}
			),
		])
	}

	get scale() {
		// Scale depends on how far from the destination compared to max distance
		if (this.destination && this.maxDistance) {
			const x = Normalize(Distance.between(this.player, this.destination), this.maxDistance)
			return Math.min(x, 5)
		}
		return 1
	}

	update() {
		if (this.destination && !this.arrived) {
			// Move the player towards the destination
			this.player.moveTowards(this.destination, 400)

			// If player reached destination
			if (this.player.touches(this.destination) && this.scale < 2) {
				this.onArrival(this.destination)

				// Reset jump state
				this.destination = null
				this.maxDistance = null
				this.arrived = true
			}
		}

		this.localObjects.update()
	}

	draw(draw) {
		this.localObjects.draw(draw)
	}
}
