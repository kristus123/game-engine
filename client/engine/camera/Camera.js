export class Camera {
	static initialize() { // initialize() Mouse first

		this.objectToFollow = Entity(WorldPosition(0, 0, 1, 1), 1, 1)

		this.position = this.objectToFollow.position.smooth()
		this.zoom = 1 // used some places
	}

	static get offset() {
		return {
			x: Screen.width / 2,
			y: Screen.height / 2,
		}
	}

	static applyPositionContextThing(palette, run) {
		this.position.update()

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
		this.position = o.position.smooth()
	}

	static goTo(o) { // this is wrong
		this.objectToFollow.x = o.x
		this.objectToFollow.y = o.y
	}

	static followInstantly(o) {
		this.objectToFollow = o

		this.position.x = o.x
		this.position.y = o.y
	}

}
