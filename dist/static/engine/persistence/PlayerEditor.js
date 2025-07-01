import { a } from '/static/engine/code_tools/a.js'; 
import { Controller } from '/static/engine/controller/Controller.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { MouseEditor } from '/static/engine/controller/mouse/MouseEditor.js'; 
import { Camera } from '/static/engine/core/camera/Camera.js'; 
import { Button } from '/static/engine/graphics/ui/Button.js'; 
import { Overlay } from '/static/engine/graphics/ui/Overlay.js'; 
import { Http } from '/static/engine/http/Http.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { Player } from '/static/game/world/player/Player.js'; 

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
				Controller.control(player)
				Overlay.clearBottom()
				Overlay.bottomButton('back to camera', () => {
					Controller.control(Camera.objectToFollow)
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
