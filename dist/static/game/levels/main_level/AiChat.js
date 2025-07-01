import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Dialogue } from '/static/engine/mechanics/dialogue/Dialogue.js'; 
import { D } from '/static/game/world/D.js'; 

export class AiChat {
	constructor(position) {

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 

		const p = position.offset(-300, -100)
		p.width = 700
		p.height = 100

		const yes = Reply('Too much',
			Conversation('People have to stop throwing their piss directly out in space', [
				Reply('ok!', Conversation('Great. Now, get to work!', []))
			]),
		)

		const no = Reply('Why is there so much piss here?',
			Conversation('People have to stop throwing their piss directly out in space', [
				Reply('I think everyone does it', Conversation('Unfortunately', []))
			]),
		)

		this.dialogue = new Dialogue(Conversation('quite a lot of piss around i must say', [
			yes,
			no,
		]), p)
	}

	update() {
	}

	draw(draw, guiDraw) {
		this.dialogue.draw(draw, guiDraw)
	}
}
