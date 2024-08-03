export class Camera {
	constructor() {

		this.palette = Palette.offscreen()

		this.objectToFollow = new DynamicGameObject(new Position(0, 0, 1, 1), 1, 1)
		this.position = new Position(0, 0)

		this.offset = {
			x: Palette.width / 2,
			y: Palette.height / 2,
		}

		this.smoothZoom = new SmoothValue(1, 1, 0.001, 0.5)
		this.velocityPrediction = {
			x: new SmoothValue(0, 0, 0.001, 0.0001),
			y: new SmoothValue(0, 0, 0.001, 0.0001),
		}

		Mouse.scrollIn = () => {
			this.smoothZoom.targetValue += 1
			if (this.zoom.currentValue > 10) {
			}
		}

		Mouse.scrollOut = () => {
			this.smoothZoom.targetValue -= 1
			if (this.zoom.currentValue > 10) {
			}
		}

		this.anchoredPositions = new LocalObjects([
			new Anchor(this, Mouse.position, 500, 0.01),
		])
	}

	get zoom() {
		return this.smoothZoom.currentValue
	}

	set zoom(x) {
		this.smoothZoom.targetValue = x
	}

	context(run) {
		this.smoothZoom.update()

		this.position.x = this.objectToFollow.position.center.x
		this.position.y = this.objectToFollow.position.center.y

		this.anchoredPositions.update()

		LowLevelCamera.context(this, run)
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

		this.position.x = o.position.x
		this.position.y = o.position.y
	}
}

