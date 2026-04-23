export class Camera {
	static initialize() { // initialize() Mouse first

		this.position = WorldPosition(0, 0)
		this.zoom = 1 // used some places
	}

	static get offset() {
		return {
			x: (Screen.width / 2).round(), // This can be improved. it is hacky
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
		// Assert.type(o, WorldPosition)

		this.position = o
	}

}
