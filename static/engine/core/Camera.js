function limitNumber(num, min, max) {
	const MIN = min ?? 1
	const MAX = max ?? 20
	const parsed = parseInt(num)
	return Math.min(Math.max(parsed, MIN), MAX)
}

export class Camera {
	constructor(mouse) {
		this.mouse = mouse
		this.palette = Palette.offscreen()

		this.objectToFollow = new GameObject(0, 0, 1, 1, 1, 1)
		this.position = new Position(0, 0)

		this.offset = {
			x: Palette.width / 2,
			y: Palette.height / 2,
		}

		this.smoothZoom = new SmoothValue(1, 1, 0.01, 0.0001)
	}

	get zoom() {
		return this.smoothZoom.currentValue
	}

	set zoom(x) {
		this.smoothZoom.targetValue = x
	}

	context(run) {
		this.smoothZoom.update()
		this.palette.ctx.save()

		this.position.x += (this.objectToFollow.velocity.x * 0.002)
		this.position.y += (this.objectToFollow.velocity.y * 0.002)

		// const smoothness = 1 //0.01
		// const smoothness = 1 //0.01
		const smoothness = 0.001

		this.position.x += (this.objectToFollow.position.center.x - this.position.x) * smoothness
		this.position.y += (this.objectToFollow.position.center.y - this.position.y) * smoothness

		const x_distanceToMouse = this.mouse.position.x - this.position.x
		this.position.x += limitNumber(x_distanceToMouse, -100, 100) * 0.01

		const y_distanceToMouse = this.mouse.position.y - this.position.y
		this.position.y += limitNumber(y_distanceToMouse, -100, 100) * 0.01


		this.palette.ctx.translate(
			-this.position.x * this.zoom + this.offset.x,
			-this.position.y * this.zoom + this.offset.y
		)

		this.palette.ctx.scale(this.zoom, this.zoom)

		run()

		this.palette.ctx.restore()
	}

	follow(o) {
		this.objectToFollow = o
	}
}

