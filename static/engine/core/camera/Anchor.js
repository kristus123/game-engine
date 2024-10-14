function limitNumber(number, min, max) { // not the best method name
	const MIN = min ?? 1
	const MAX = max ?? 20
	return Math.min(Math.max(parseInt(number), MIN), MAX)
}

export class Anchor {
	constructor(anchoredPosition, maxPixelMovement=500, multiplier=1, smoothness=0.1) {

		this.smoothPosition = new SmoothPosition(anchoredPosition, smoothness, 100)
	}

	update() {
		this.smoothPosition.update(this.anchoredPosition)

		const x_distanceToMouse = this.smoothPosition.position.x - Cam.position.x
		Cam.position.x += limitNumber(x_distanceToMouse, -this.maxPixelMovement, this.maxPixelMovement) * this.multiplier

		const y_distanceToMouse = this.smoothPosition.position.y - Cam.position.y
		Cam.position.y += limitNumber(y_distanceToMouse, -this.maxPixelMovement, this.maxPixelMovement) * this.multiplier
	}
}
