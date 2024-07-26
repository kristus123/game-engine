function limitNumber(num, min, max) { // not the best method name
	const MIN = min ?? 1
	const MAX = max ?? 20
	const parsed = parseInt(num)
	return Math.min(Math.max(parsed, MIN), MAX)
}

export class Camera {
	constructor() {

		this.palette = Palette.offscreen()

		this.objectToFollow = new DynamicGameObject(new Position(0, 0, 1, 1), 1, 1)
		this.position = new Position(0, 0)

		this.offset = {
			x: Palette.width / 2,
			y: Palette.height / 2,
		}

		this.smoothZoom = new SmoothValue(1, 1, 0.01, 0.0001)
		this.velocityPrediction = {
			x: new SmoothValue(0, 0, 0.001, 0.0001),
			y: new SmoothValue(0, 0, 0.001, 0.0001),
		}

		this.smoothMovement = 0.05

		// it is being set right after initializing this class
		this.mouse = null
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

		this.position.x += this.objectToFollow.position.center.x - this.position.x
		this.position.y += this.objectToFollow.position.center.y - this.position.y

		this.velocityPrediction.x.targetValue = (this.objectToFollow.velocity.x * 5)
		this.velocityPrediction.y.targetValue = (this.objectToFollow.velocity.y * 5)
		this.velocityPrediction.x.update()
		this.velocityPrediction.y.update()
		console.log(this.velocityPrediction.y.currentValue)
		this.position.x += this.velocityPrediction.x.currentValue
		this.position.y += this.velocityPrediction.y.currentValue

		const x = 500
		this.position.x += limitNumber(this.objectToFollow.position.center.x * this.smoothMovement, -x, x)
		this.position.y += limitNumber(this.objectToFollow.position.center.y * this.smoothMovement, -x, x)


		const cx = 0.5
		const maxMouseImpact = 1
		const x_distanceToMouse = Mouse.position.x - this.position.x
		this.position.x += limitNumber(x_distanceToMouse, -maxMouseImpact, maxMouseImpact) * cx

		const y_distanceToMouse = Mouse.position.y - this.position.y
		this.position.y += limitNumber(y_distanceToMouse, -maxMouseImpact, maxMouseImpact) * cx

		this.palette.ctx.translate(
			-this.position.x * this.zoom + this.offset.x,
			-this.position.y * this.zoom + this.offset.y)

		this.palette.ctx.scale(this.zoom, this.zoom)

		run()

		this.palette.ctx.restore()
	}

	follow(o) {
		this.objectToFollow = o
	}

	goTo(o) {
		this.objectToFollow.x = o.x
		this.objectToFollow.y = o.y
	}

	followInstantly(o) {
		this.objectToFollow = o
		this.position = o.position.copy()
	}
}

