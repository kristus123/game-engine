export class Camera {
	static transformEnabled = true
	static rotationDegrees = 0

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
		const rotation = this.rotationDegrees * Math.PI / 180
		const cosine = Math.cos(rotation)
		const sine = Math.sin(rotation)
		const zoom = this.transformEnabled ? this.zoom : 1
		const position = this.transformEnabled ? this.position : { x, y }
		const a = zoom * cosine
		const b = zoom * sine
		const c = -zoom * sine
		const d = zoom * cosine

		return [a, b, c, d, x - a * position.x - c * position.y, y - b * position.x - d * position.y]
	}

	static rotate(degrees) {
		this.rotationDegrees += degrees
	}

	static follow(o) {
		this.position = o
		// console.log(o)
	}

	static p(p) {
		const { x, y } = this.offset
		const rotation = this.rotationDegrees * Math.PI / 180
		const cosine = Math.cos(rotation)
		const sine = Math.sin(rotation)
		const zoom = this.transformEnabled ? this.zoom : 1
		const position = this.transformEnabled ? this.position : { x, y }
		const dx = p.x - position.x
		const dy = p.y - position.y

		return new WorldPosition(
			(zoom * (cosine * dx - sine * dy)) + x,
			(zoom * (sine * dx + cosine * dy)) + y)
	}

	static update() {
		const rotation = this.rotationDegrees * Math.PI / 180
		const cosine = Math.abs(Math.cos(rotation))
		const sine = Math.abs(Math.sin(rotation))
		const zoom = this.transformEnabled ? this.zoom : 1
		const position = this.transformEnabled ? this.position : this.offset
		const halfWidth = (cosine * Palette.width + sine * Palette.height) / (2 * zoom)
		const halfHeight = (sine * Palette.width + cosine * Palette.height) / (2 * zoom)
		this.visiblePosition.x = position.x - halfWidth
		this.visiblePosition.y = position.y - halfHeight
		this.visiblePosition.width = halfWidth * 2
		this.visiblePosition.height = halfHeight * 2

		// console.log(this.position)
	}

	static insideView(entity) {
		return Collision.coveredEntirely(this.visiblePosition, entity.position)
	}

}
