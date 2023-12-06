export class FetchContainerExtension {
	constructor(spaceship) {
		this.spaceship = spaceship

		this.container = new Crate({x:0, y:200})
		this.connectedToSpaceship = false
		this.ropeLength = 400 // Set your desired rope length here

	}

	update() {
		if (this.connectedToSpaceship) {
			this.container.followIfOutsideOfRadius(this.spaceship, this.ropeLength)
		}
		else if (Distance.withinRadius(this.container,this.spaceship,this.ropeLength)) {
			this.connectedToSpaceship = true
		}
	}

	draw(ctx) {
		this.container.draw(ctx)

		if (this.connectedToSpaceship) {
			Draw.lineBetween(ctx, this.spaceship.position.center, this.container.position.center)
		}
	}
}
