export class DatingSimLevel {
	constructor(level, allObjects,camera) {

		allObjects.register(this, [
			new Chat( camera),
		])
	}

	update() {
	}

	draw(draw, guiDraw) {
	}
}
