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
		this.visiblePosition.height = Screen.height - 500
	}

	static insideView(entity) {
		const position = entity.position ?? entity
		const width = position.width ?? 0
		const height = position.height ?? 0
		const halfWidth = Screen.width / this.zoom / 2
		const halfHeight = Screen.height / this.zoom / 2

		const viewLeft = this.position.x - halfWidth
		const viewRight = this.position.x + halfWidth
		const viewTop = this.position.y - halfHeight
		const viewBottom = this.position.y + halfHeight

		const entityLeft = position.x
		const entityRight = position.x + width
		const entityTop = position.y
		const entityBottom = position.y + height

		return entityRight >= viewLeft
            && entityLeft <= viewRight
            && entityBottom >= viewTop
            && entityTop <= viewBottom
	}
}


