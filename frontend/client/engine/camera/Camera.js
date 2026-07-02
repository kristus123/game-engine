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

	static top(percent = 1) {
		const h = this.visiblePosition.height * Math.abs(percent)
		const y = percent >= 0 ? this.visiblePosition.y : this.visiblePosition.y - h
		return WorldPosition(
			this.visiblePosition.x,
			y,
			this.visiblePosition.width,
			h
		)
	}

	static bottom(percent = 1) {
		const h = this.visiblePosition.height * Math.abs(percent)
		const y = percent >= 0 ? this.visiblePosition.y + this.visiblePosition.height - h : this.visiblePosition.y + this.visiblePosition.height
		return WorldPosition(
			this.visiblePosition.x,
			y,
			this.visiblePosition.width,
			h
		)
	}

	static left(percent = 1) {
		const w = this.visiblePosition.width * Math.abs(percent)
		const x = percent >= 0 ? this.visiblePosition.x : this.visiblePosition.x - w
		return WorldPosition(
			x,
			this.visiblePosition.y,
			w,
			this.visiblePosition.height
		)
	}

	static right(percent = 1) {
		const w = this.visiblePosition.width * Math.abs(percent)
		const x = percent >= 0 ? this.visiblePosition.x + this.visiblePosition.width - w : this.visiblePosition.x + this.visiblePosition.width
		return WorldPosition(
			x,
			this.visiblePosition.y,
			w,
			this.visiblePosition.height
		)
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

	static smoothing(target, lerpSpeed = 1.2) { // we can use this one later
		const dx = target.x - this.position.x
		const dy = target.y - this.position.y
		if (Math.hypot(dx, dy) > 0.5) {
			this.position.x += dx * lerpSpeed * DeltaTime.value
			this.position.y += dy * lerpSpeed * DeltaTime.value
		}
		else {
			this.position.x = target.x
			this.position.y = target.y
		}
	}

	static insideView(entity) {
		return Collision.coveredEntirely(this.visiblePosition, entity.position)
	}

}
