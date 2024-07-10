export class NoteEditor {
	constructor() {
		const body = Http.get('/persisted-objects/image.json')

		const picture = new StaitcPicture(new Position(body.x, body.y), body.message)

		const mouseEditor = new MouseEditor()
		mouseEditor.add(picture)

		mouseEditor.onClick = p => {
		}

		mouseEditor.moved = o => {
			const body = {
				x: picture.x,
				y: picture.y,
				message: picture.message,
			}
			Http.post('/persisted-objects/image.json', body)
		}

		mouseEditor.remove = o => {
		}

		Overlay.rightButton('note', () => {
			MouseEditor.active = mouseEditor
			// Cam.goTo(player)
		})

		this.localObjects = new LocalObjects([
			picture,
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
