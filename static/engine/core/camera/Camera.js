export class Camera {
	constructor() {

		this.offset = {
			x: Palette.width / 2,
			y: Palette.height / 2,
		}

		this.palette = Palette.offscreen(() => {
			this.offset = {
				x: Palette.width / 2,
				y: Palette.height / 2,
			}
		})

		this.objectToFollow = new DynamicGameObject(new Position(0, 0, 1, 1), 1, 1)

		this.position = new Position(0, 0)
		this.smoothPosition = new SmoothPosition(this.position, 0.01)



		this.smoothZoom = new SmoothValue(1, 1, 0.001, 0.5)

		// Mouse.scrollIn = () => {
		// 	this.smoothZoom.targetValue += 1
		// 	if (this.zoom.currentValue > 10) {
		// 	}
		// }

		// Mouse.scrollOut = () => {
		// 	this.smoothZoom.targetValue -= 1
		// 	if (this.zoom.currentValue > 10) {
		// 	}
		// }

		this.anchoredPositions = new LocalObjects([
			new Anchor(Mouse.position, 1_000, 0.1),
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

		this.smoothPosition.update(this.objectToFollow)
		this.position.x = this.smoothPosition.position.x
		this.position.y = this.smoothPosition.position.y


		this.anchoredPositions.update()
		// this.anchoredPositions.objects.forEach(a => {
		// 	console.log(a.smoothPosition.position.x)
		// })

		LowLevelCamera.context(this, run)
	}

	follow(o) {
		this.objectToFollow = o
	}

	goTo(o) { // this is wrong
		this.objectToFollow.x = o.x
		this.objectToFollow.y = o.y
	}

	followInstantly(o) {
		this.objectToFollow = o

		this.position.x = o.position.x
		this.position.y = o.position.y
	}

	p(p) {
		return new Position(
			p.x - this.position.x + p.width + 200,
			p.y - this.position.y + p.height + 200,
		)
	}
}

