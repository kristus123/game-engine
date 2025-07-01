import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Picture } from '/static/engine/code_tools/misc/Picture.js'; 

export class PicturesLoop {
	constructor(position) {

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 

		position.width = 250
		this.pictures = [
			new Picture(position, '/static/assets/lift_1.png'),
			new Picture(position, '/static/assets/lift_2.png'),
		]

		this.currentFrame = 0

		setInterval(() => {
			this.currentFrame = (this.currentFrame + 1) % this.pictures.length
		}, 200)
	}

	draw(draw, guiDraw) {
		this.pictures[this.currentFrame].draw(draw, guiDraw)
	}
}
