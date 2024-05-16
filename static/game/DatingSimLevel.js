export class DatingSimLevel {
	constructor(level, allGameObjects, camera, mouse) {

		allGameObjects.register(this, [
			new Chat(camera, mouse),
		])
	}

	update() {
	}

	draw(draw, guiDraw) {
	}
}
