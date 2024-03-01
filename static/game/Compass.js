export class Compass {
	constructor(camera, target) {
	}

	draw(draw, guiDraw) {
		guiDraw.objectThatIsMovingInRectangularPathAroundObject(this.camera, this.target)
	}
}
