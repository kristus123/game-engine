import { a } from '/static/engine/a.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { Palette } from '/static/engine/core/Palette.js'; 
import { Camera } from '/static/engine/core/camera/Camera.js'; 
import { Position } from '/static/engine/core/position/Position.js'; 

export class PictureInPicture {
	constructor() {


		this.position = new Position(200, 100, 400, 500)
	}

	draw(draw, guiDraw) {
		const imageData = draw.ctx.getImageData(this.position.x, this.position.y, this.position.width, this.position.height)

		draw.ctx.putImageData(imageData,
			Mouse.position.x - Camera.position.x + (Palette.width/2),
			Mouse.position.y - Camera.position.y + (Palette.height/2))
	}
}

