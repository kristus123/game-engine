export class SmoothPosition {
	constructor(targetPosition, smoothness=0.01, threshold=0.0001) {
		this.position = new Position(0, 0)

		this.localObjects = new LocalObjects([
			Init(this, {
				smooth_x: new SmoothValue(this.position.x, targetPosition.x, smoothness, threshold),
				smooth_y: new SmoothValue(this.position.y, targetPosition.y, smoothness, threshold),
			})
		])
	}

	update(targetPosition) {
		this.position.x = this.smooth_x.currentValue
		this.position.y = this.smooth_y.currentValue

		this.smooth_x.targetValue = targetPosition.x
		this.smooth_y.targetValue = targetPosition.y

		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		draw.circle(this.position)
	}
}
