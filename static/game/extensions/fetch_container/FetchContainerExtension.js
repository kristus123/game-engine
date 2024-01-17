export class FetchContainerExtension {
	constructor(spaceship) {
		this.spaceship = spaceship

		this.container = new Crate({ x: 100, y: 200 })
		this.connectedToSpaceship = false
		this.ropeLength = 400 // Set your desired rope length here

		this.deliverySpot = new Position(15000, 200)
		this.delivered = false
	}

	update() {
		if (this.connectedToSpaceship) {
			this.container.followIfOutsideOfRadius(this.spaceship, this.ropeLength)
		}
		else if (Distance.withinRadius(this.container, this.spaceship, this.ropeLength) && !this.delivered) {
			this.connectedToSpaceship = true
		}

		if (!this.delivered && Distance.withinRadius(this.container.position.center, this.deliverySpot, 200)) {
			this.delivered = true
			this.connectedToSpaceship = false
			this.container.resetVelocity()
			this.spaceship.resetVelocity()
		}
	}

	draw(ctx) {

		this.container.draw(ctx)

		if (this.connectedToSpaceship) {
			Draw.lineBetween(this.spaceship.position.center, this.container.position.center)
		}

		if (this.delivered) {
			Draw.hollowCircle(this.deliverySpot, 'green', 200)
		}
		else {
			Draw.hollowCircle(this.deliverySpot, 'red', 200)
		}

		if (this.connectedToSpaceship) {
			Draw.new_text(this.container, 'Bring me to the destination')

			const p = Draw.objectThatIsMovingInRectangularPathAroundObject(this.spaceship, this.deliverySpot)
			Draw.new_text(p, Math.round(Distance.between(this.container, this.deliverySpot)))
		}
		else if (this.delivered) {
			Draw.new_text(this.container, 'Good job!')
		}
		else {
			const x = this.spaceship.position.copy()
			x.y -= 100
			Draw.new_text(x, 'Enter spaceship')
			Draw.new_text(this.container, 'pick up crate')
		}

	}
}
