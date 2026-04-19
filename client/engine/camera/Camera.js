export class Camera {
	static initialize() { // initialize() Mouse first

		this.objectToFollow = Entity(WorldPosition(0, 0, 1, 1), 1, 1)

		this.position = this.objectToFollow.position
		this.zoom = 1 // used some places
	}

	static get offset() {
		return {
			x: (Screen.width / 2).round(), // maybe this can be improved
			y: (Screen.height / 2).round(),
		}
	}

	static applyPositionContextThing(palette, run) {

		const ctx = palette.ctx

		ctx.save()

		ctx.translate(this.offset.x, this.offset.y)

		ctx.scale(this.zoom, this.zoom)

		ctx.translate(-this.position.x, -this.position.y)

		run()

		ctx.restore()
	}

	static follow(o) {
		this.objectToFollow = o
		this.position = o.position
	}

}
