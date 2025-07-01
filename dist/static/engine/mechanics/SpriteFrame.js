import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 

export class SpriteFrame {
	constructor(position, imagePath, frame) {

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(imagePath, "argument imagePath in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(frame, "argument frame in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 
		this.imagePath = imagePath; 
		this.frame = frame; 

		this.frame = new Sprite(position, imagePath, [frame])
	}

	update() {

	}

	draw(draw, guiDraw) {
		this.frame.draw(draw, guiDraw)
	}
}
