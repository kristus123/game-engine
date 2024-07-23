export class PlayerEditor {
	constructor() {
		const body = Http.get('/persisted-objects/player.json')

		const player = new Player(new Position(body.x, body.y))
		this.player = player

		const mouseEditor = new MouseEditor()
		mouseEditor.add(player)

		mouseEditor.onClick = p => {
			console.log('do nothing')
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

			Overlay.bottomButton('control player', () => {
				Controller.control(this.player)
				Overlay.clearBottom()
				Overlay.bottomButton('back to camera', () => {
					Controller.control(Cam.objectToFollow)
				})
			})
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
