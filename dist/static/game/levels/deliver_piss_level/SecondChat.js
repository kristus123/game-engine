import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Dialogue } from '/static/engine/mechanics/dialogue/Dialogue.js'; 
import { D } from '/static/game/world/D.js'; 

export class SecondChat {
	constructor(position) {

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 

		const p = position.copy()
		p.width = 700
		p.height = 100

		this.dialogue = new Dialogue(Conversation('Good job!', [
			Reply('What do i do now?', Conversation('Well, my plan is to head home and watch TV. Bye Kid', [
				Reply('What about me?', Conversation('Go back to the factory and deliver your load', [])),
			])),
		]), p)
	}

	update() {
	}

	draw(draw, guiDraw) {
		this.dialogue.draw(draw, guiDraw)
	}
}
