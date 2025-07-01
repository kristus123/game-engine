import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Blur } from '/static/engine/mechanics/Blur.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { SexyChat } from '/static/game/legacy/SexyChat.js'; 
import { D } from '/static/game/world/D.js'; 

export class Chat {
	constructor(camera) {

				AssertNotNull(camera, "argument camera in " + this.constructor.name + ".js should not be null")
			
		this.camera = camera; 


		this.localObjects = new LocalObjects([
		])

		// this.blur = new Blur(camera)
		this.thing = new SexyChat(new Position(0, -200))

		this.picture = new DynamicGameObject(new Position(-800, -400, 600, 600), 10, 10, '/static/assets/art/bar.jpg')
	}

	update() {
		this.localObjects.update()

		this.thing.update()
	}

	draw(draw, guiDraw) {
		// this.blur.draw(draw, guiDraw)
		this.picture.draw(draw)
		this.thing.draw(draw)

		this.localObjects.draw(draw, guiDraw)
	}

}
