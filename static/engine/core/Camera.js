function limitNumber(num, min, max) { // not the best method name
	const MIN = min ?? 1
	const MAX = max ?? 20
	const parsed = parseInt(num)
	return Math.min(Math.max(parsed, MIN), MAX)
}

export class Camera {
	static palette = Palette.offscreen()

	static objectToFollow = new DynamicGameObject(new Position(0, 0, 1, 1), 1, 1)
	static position = new Position(0, 0)

	static offset = {
		x: Palette.width / 2,
		y: Palette.height / 2,
	}

	static smoothZoom = new SmoothValue(1, 1, 0.01, 0.0001)
	static velocityPrediction = 0.1
	static smoothMovement = 0.05

	static get zoom() {
		return this.smoothZoom.currentValue
	}

	static set zoom(x) {
		this.smoothZoom.targetValue = x
	}

	static context(run) {
		this.smoothZoom.update()

		this.palette.ctx.save()

		this.position.x += (this.objectToFollow.position.center.x - this.position.x)
		this.position.y += (this.objectToFollow.position.center.y - this.position.y)

		this.position.x += (this.objectToFollow.velocity.x * this.velocityPrediction)
		this.position.y += (this.objectToFollow.velocity.y * this.velocityPrediction)

		const x = 200
		this.position.x += limitNumber(this.objectToFollow.position.center.x * this.smoothMovement, -x, x)
		this.position.y += limitNumber(this.objectToFollow.position.center.y * this.smoothMovement, -x, x)


		const x_distanceToMouse = Mouse.position.x - this.position.x
		this.position.x += limitNumber(x_distanceToMouse, -100, 100) * 0.01

		const y_distanceToMouse = Mouse.position.y - this.position.y
		this.position.y += limitNumber(y_distanceToMouse, -100, 100) * 0.01


		this.palette.ctx.translate(
			-this.position.x * this.zoom + this.offset.x,
			-this.position.y * this.zoom + this.offset.y
		)

		this.palette.ctx.scale(this.zoom, this.zoom)

		run()

		this.palette.ctx.restore()
	}

	static follow(o) {
		this.objectToFollow = o
	}

	static followInstantly(o) {
		this.objectToFollow = o
		this.position = o.position.copy()
	}
}

