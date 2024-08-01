function limitNumber(number, min, max) { // not the best method name
	const MIN = min ?? 1
	const MAX = max ?? 20
	return Math.min(Math.max(parseInt(number), MIN), MAX)
}

export class Anchor {
	constructor(camera, anchorPosition, maxPixelMovement, multiplier=1) {

		this.localObjects = new LocalObjects([
			Init(this, {
				x: new SmoothValue(anchorPosition.x, anchorPosition.x, 0.01, 0.005),
				y: new SmoothValue(anchorPosition.y, anchorPosition.y, 0.01, 0.005),
			}),
			Update(() => {
				this.x.targetValue = anchorPosition.x
				this.y.targetValue = anchorPosition.y
			}),
			Update(() => {
				camera.position.x += limitNumber(this.x.currentValue, -maxPixelMovement, maxPixelMovement, multiplier)
				camera.position.y += limitNumber(this.y.currentValue, -maxPixelMovement, maxPixelMovement, multiplier)
			}),
		])
	}


	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}

}
