import { a } from '/static/engine/code_tools/a.js'; 
import { Picture } from '/static/engine/code_tools/misc/Picture.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { MouseEditor } from '/static/engine/controller/mouse/MouseEditor.js'; 
import { Camera } from '/static/engine/core/camera/Camera.js'; 
import { Button } from '/static/engine/graphics/ui/Button.js'; 
import { Overlay } from '/static/engine/graphics/ui/Overlay.js'; 
import { Http } from '/static/engine/http/Http.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Position } from '/static/engine/position/Position.js'; 

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
			// Camera.goTo(player)
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
