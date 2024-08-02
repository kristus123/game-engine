export class SmoothPosition {
	constructor(currentPosition, targetPosition, smoothness=0.01, threshold=0.0001) {

		this.localObjects = new LocalObjects([
			Init(this, {
				x: new SmoothValue(currentPosition.x, targetPosition.x, smoothness, threshold),
				y: new SmoothValue(currentPosition.y, targetPosition.y, smoothness, threshold),
			})
		])
	}

	update() {
		this.x.targetValue = this.targetPosition.x
		this.y.targetValue = this.targetPosition.y

		this.localObjects.update()

		this.currentPosition.x = this.x.currentValue
		this.currentPosition.y = this.y.currentValue
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		draw.circle(this.currentPosition)
	}
}
