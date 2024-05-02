export class DatingSimLevel {
	constructor(levelSelector, allGameObjects, camera, mouse) {

		allGameObjects.register(this, [
			new Chat(camera, mouse),
		])
	}

	update() {
	}

	draw(draw, guiDraw) {
	}
}
