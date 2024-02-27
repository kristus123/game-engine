export class Compass {
	constructor(camera, target) {
	}

	draw(draw) {
		draw.objectThatIsMovingInRectangularPathAroundObject(this.camera, this.target)
	}
}
