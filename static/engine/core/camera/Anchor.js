function limitNumber(number, min, max) { // not the best method name
	const MIN = min ?? 1
	const MAX = max ?? 20
	return Math.min(Math.max(parseInt(number), MIN), MAX)
}

export class Anchor {
	constructor(camera, anchoredPosition, maxPixelMovement=500, multiplier=1) {

	}

	update() {
		const x_distanceToMouse = this.anchoredPosition.x - this.camera.position.x
		this.camera.position.x += limitNumber(x_distanceToMouse, -this.maxPixelMovement, this.maxPixelMovement) * this.multiplier
		const y_distanceToMouse = this.anchoredPosition.y - this.camera.position.y
		this.camera.position.y += limitNumber(y_distanceToMouse, -this.maxPixelMovement, this.maxPixelMovement) * this.multiplier
	}

}
