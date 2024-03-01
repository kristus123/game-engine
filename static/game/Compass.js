export class Compass {
	constructor(camera, target) {
	}

	draw(draw, guiDraw) {
		draw.objectThatIsMovingInRectangularPathAroundObject(this.camera, this.target)
	}
}
