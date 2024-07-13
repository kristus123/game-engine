export class Note extends StaticGameObject {
	constructor(position, message) {
		super(position)

		this.position.width = 50
		this.position.height = 50

		this.localObjects = new LocalObjects([
			new MultiTextTyper(this.position.offset(0, -100), [
				'huh, a note .   .    .      .',
				'what does it say?',
				message,
				'. . . . .',
				'what an insane message',
			])
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		super.draw(draw, guiDraw)
		this.localObjects.draw(draw, guiDraw)
	}
}
