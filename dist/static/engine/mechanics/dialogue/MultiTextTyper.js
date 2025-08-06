import { List } from '/static/engine/List.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { BackspaceEffect } from '/static/engine/mechanics/dialogue/BackspaceEffect.js'; 
import { Text } from '/static/engine/mechanics/dialogue/Text.js'; 
import { TextTyper } from '/static/engine/mechanics/dialogue/TextTyper.js'; 
import { TextTyperWithBackspaceEffect } from '/static/engine/mechanics/dialogue/TextTyperWithBackspaceEffect.js'; 

export class MultiTextTyper {
	constructor(position, texts, onFinish=() => {}) {

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(texts, "argument texts in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(onFinish, "argument onFinish in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 
		this.texts = texts; 
		this.onFinish = onFinish; 

		this.texts = texts.map(t => new TextTyperWithBackspaceEffect(t))
		this.index = 0

		this.finished = false // rename to completed
	}

	update() {
		if (List.validIndex(this.texts, this.index)) {
			const t = this.texts[this.index]

			if (!t.finished) {
				console.log('hei')
				t.update()
			}
			else {
				this.index += 1
			}
		}
		else {
			this.finished = true
			this.onFinish()
			this.update = () => {}
			this.draw = () => {}
		}
	}

	get text() {
		if (List.validIndex(this.texts, this.index)) {
			return this.texts[this.index].text
		}
		else {
			return ''
		}
	}

	draw(draw, guiDraw) {
		draw.text(this.position, this.text)
	}
}
