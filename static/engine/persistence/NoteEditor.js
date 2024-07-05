export class NoteEditor {
	constructor() {
		const body = Http.get('/persisted-objects/note.json')

		const note = new Note(new Position(body.x, body.y), body.message)

		const mouseEditor = new MouseEditor()
		mouseEditor.add(note)

		mouseEditor.onClick = p => {
		}

		mouseEditor.moved = o => {
			const body = {
				x: note.x,
				y: note.y,
				message: note.message,
			}
			Http.post('/persisted-objects/note.json', body)
		}

		mouseEditor.remove = o => {
		}

		Overlay.rightButton('note', () => {
			MouseEditor.active = mouseEditor
			// Cam.goTo(player)
		})

		this.localObjects = new LocalObjects([
			note,
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
