import { G } from '/static/engine/G.js'; 
import { List } from '/static/engine/List.js'; 
import { ListLooper } from '/static/engine/ListLooper.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { TextTyper } from '/static/engine/mechanics/dialogue/TextTyper.js'; 

// example

// () => new Dialogue([
// 	new TextTyper(G.friend, 'hi there!'),
// 	new TextTyper(G.player, 'what should i do?'),
// 	new TextTyper(G.friend, 'try to poop by pressing "p"'),
// 	new TextTyper(G.friend, 'poop 4 times!'),
// ]),


export class Dialogue {

	constructor(textTypers) {

				AssertNotNull(textTypers, "argument textTypers in " + this.constructor.name + ".js should not be null")
			
		this.textTypers = textTypers; 


		this.listLooper = new ListLooper(textTypers, (textTyper, next, completed, draw, guiDraw) => {
			textTyper.update()
			textTyper.draw(draw, guiDraw)

			if (textTyper.completed()) {
				next()
			}
		})
	}

	completed() {
		return this.listLooper.completed()
	}

	update() {
		this.listLooper.update()
	}

	draw(draw, guiDraw) {
		this.listLooper.draw(draw, guiDraw)
	}
}
