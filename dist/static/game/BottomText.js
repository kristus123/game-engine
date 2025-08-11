import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Html } from '/static/engine/html/Html.js'; 
import { Quest } from '/static/engine/mechanics/quest/Quest.js'; 

export class BottomText {
	constructor(texts) {

				AssertNotNull(texts, "argument texts in " + this.constructor.name + ".js should not be null")
			
		this.texts = texts; 

		this.quest = new Quest(texts.map(t => () =>
			new class {
				constructor() {
					Html.lower([
						Html.img(),
						Html.div('big', [
							Html.p(t),
							Html.button('next', () => {
								Html.clearLower()
								this.completed = () => true
							})
						]),
					])
				}
			}))
	}

	update() {
		this.quest.update()
	}
	
	draw(draw, guiDraw) {
		this.quest.draw(draw, guiDraw)
	}
}
