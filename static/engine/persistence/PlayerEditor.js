export class PlayerEditor {
	constructor() {
		const body = Http.get('/persisted-objects/player.json')

		const player = new Player(new Position(body.x, body.y))

		const mouseEditor = new MouseEditor()
		mouseEditor.add(player)

		mouseEditor.onClick = p => {
		}

		mouseEditor.moved = o => {
			const body = {
				x: player.x,
				y: player.y,
			}
			Http.post('/persisted-objects/player.json', body)
		}

		mouseEditor.remove = o => {
		}

		Overlay.rightButton('player', () => {
			MouseEditor.active = mouseEditor
			// Cam.goTo(player)
		})

		this.localObjects = new LocalObjects([
			player,
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
