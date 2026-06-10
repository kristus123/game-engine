export class Camera {
	static initialize() { // initialize() Mouse first

		this.position = WorldPosition(0, 0)
		this.zoom = 1 // used some places
		this.visiblePosition = WorldPosition(0, 0)
	}


	static get offset() {
		return {
			x: (Screen.width / 2).round(), // This can be improved. it is hacky
			y: (Screen.height / 2).round(),
		}
	}

	static applyPositionContextThing(ctxes, run) {
		for (const ctx of ctxes) {
			ctx.save()

			ctx.translate(this.offset.x, this.offset.y)

			ctx.scale(this.zoom, this.zoom)

			ctx.translate(-this.position.x, -this.position.y)
		}

		run()

		for (const ctx of ctxes) {
			ctx.restore()
		}

	}

	static follow(o) {
		this.position = o
	}

	static p(p) {
		return new WorldPosition(
			p.x - this.position.x + (Screen.width/2),
			p.y - this.position.y + (Screen.height/2))
	}


	static update() {
		this.visiblePosition.x = Camera.position.x - Screen.width / 2
		this.visiblePosition.y = Camera.position.y - Screen.height / 2
		this.visiblePosition.width = Screen.width
		this.visiblePosition.height = Screen.height
	}

	static insideView(entity) {
		return Collision.between(entity.position, this.visiblePosition)
	}

}
