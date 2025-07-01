import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { MultiTextTyper } from '/static/engine/mechanics/dialogue/MultiTextTyper.js'; 
import { TextTyper } from '/static/engine/mechanics/dialogue/TextTyper.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { StaticGameObject } from '/static/engine/objects/StaticGameObject.js'; 

export class Note extends StaticGameObject {
	constructor(position, message) {
		super(position)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(message, "argument message in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 
		this.message = message; 


		this.position.width = 50
		this.position.height = 50

		this.localObjects = new LocalObjects([
			new MultiTextTyper(this.position.offset(0, -100), [
				'huh, a note .   .    .      .',
				'what does it say?',
				message,
				'. . . . .',
				'what an insane message',
			])
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		super.draw(draw, guiDraw)
		this.localObjects.draw(draw, guiDraw)
	}
}
