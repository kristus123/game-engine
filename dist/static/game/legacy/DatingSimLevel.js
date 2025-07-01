import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Chat } from '/static/game/legacy/Chat.js'; 

export class DatingSimLevel {
	constructor(level, allObjects, camera) {

				AssertNotNull(level, "argument level in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(allObjects, "argument allObjects in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(camera, "argument camera in " + this.constructor.name + ".js should not be null")
			
		this.level = level; 
		this.allObjects = allObjects; 
		this.camera = camera; 


		allObjects.register(this, [
			new Chat(camera),
		])
	}

	update() {
	}

	draw(draw, guiDraw) {
	}
}
