export class FetchContainerExtension {
	constructor(spaceship, thingToFetch) {
		this.spaceship = spaceship

		this.container = new GameObject(100, 100, 100, 100, 10, 10)
		this.container = thingToFetch
		this.connectedToSpaceship = false
		this.ropeLength = 200 // Set your desired rope length here
	}

	update() {
		if (this.connectedToSpaceship) {
			this.container.followIfOutsideOfRadius(this.spaceship, this.ropeLength)
		}
		else if (
			Distance.withinRadius(
				this.container,
				this.spaceship,
				this.ropeLength,
			)
		) {
			this.connectedToSpaceship = true
		}
	}

	draw(ctx) {
		if (this.connectedToSpaceship) {
			Draw.lineBetween(ctx, this.spaceship, this.container)
		}

		// this.container.draw(ctx)

		// Draw.text(ctx, this.container.x, this.container.y, 150, 100, 'Pick me up with the spaceship')
	}
}
