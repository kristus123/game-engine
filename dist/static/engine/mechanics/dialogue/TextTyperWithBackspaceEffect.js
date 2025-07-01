import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Call } from '/static/engine/code_tools/tools/Call.js'; 
import { BackspaceEffect } from '/static/engine/mechanics/dialogue/BackspaceEffect.js'; 
import { Text } from '/static/engine/mechanics/dialogue/Text.js'; 
import { TextTyper } from '/static/engine/mechanics/dialogue/TextTyper.js'; 

export class TextTyperWithBackspaceEffect {
	constructor(_text) {

				AssertNotNull(_text, "argument _text in " + this.constructor.name + ".js should not be null")
			
		this._text = _text; 

		this.completed = false
		this.t = new TextTyper(_text)
		this.t.onFinish = () => {
			setTimeout(() => {
				this.t = new BackspaceEffect(_text)
				this.t.onFinish = () => {
					Call(this.onFinish)
					this.completed = true
				}
			}, 900)
		}
	}

	update() {
		this.t.update()
	}

	draw(draw, guiDraw) {
	}

	get text() {
		return this.t.text
	}


}
