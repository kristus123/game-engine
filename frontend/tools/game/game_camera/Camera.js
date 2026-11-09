export class Camera {
	static initialize() { // initialize() Mouse first
		this.position ??= WorldPosition(0, 0)
		this.zoom ??= 1
		this.visiblePosition = WorldPosition(0, 0)
	}

	static get offset() {
		return {
			x: Math.round(Palette.width / 2),
			y: Math.round(Palette.height / 2),
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


	static get transform() {
		const { x, y } = this.offset
		return [this.zoom, 0, 0, this.zoom, x - this.position.x * this.zoom, y - this.position.y * this.zoom]
	}

	static follow(o) {
		this.position = o
		// console.log(o)
	}

	static p(p) {
		const { x, y } = this.offset
		return new WorldPosition(
			(p.x - this.position.x) * this.zoom + x,
			(p.y - this.position.y) * this.zoom + y)
	}

	static update() {
		const { x, y } = this.offset
		this.visiblePosition.x = this.position.x - x / this.zoom
		this.visiblePosition.y = this.position.y - y / this.zoom
		this.visiblePosition.width = Palette.width / this.zoom
		this.visiblePosition.height = Palette.height / this.zoom

		// console.log(this.position)
	}

	static insideView(entity) {
		return Collision.coveredEntirely(this.visiblePosition, entity.position)
	}

}
