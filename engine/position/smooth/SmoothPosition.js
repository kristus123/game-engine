export class SmoothPosition {
	constructor(targetPosition, smoothness=0.01, threshold=0.0001) {
		this.position = Position(0, 0)

		this.localObjects = LocalObjects([
			this.smooth_x = SmoothValue(this.position.x, targetPosition.x, smoothness, threshold),
			this.smooth_y = SmoothValue(this.position.y, targetPosition.y, smoothness, threshold),
		])
	}

	update(targetPosition) {
		this.position.x = this.smooth_x.currentValue
		this.position.y = this.smooth_y.currentValue

		this.smooth_x.targetValue = targetPosition.x
		this.smooth_y.targetValue = targetPosition.y

		this.localObjects.update()
	}

	draw(draw) {
		this.localObjects.draw(draw)

		draw.circle(this.position)
	}
}
