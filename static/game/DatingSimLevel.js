export class DatingSimLevel {
	constructor(level, allObjects, camera, mouse) {

		allObjects.register(this, [
			new Chat(camera, mouse),
		])
	}

	update() {
	}

	draw(draw, guiDraw) {
	}
}
