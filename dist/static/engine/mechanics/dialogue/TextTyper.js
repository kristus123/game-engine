import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { OnTrue } from '/static/engine/code_tools/OnTrue.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 

export class TextTyper {
	constructor(position, textToType, framesPerLetter=4) {

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(textToType, "argument textToType in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(framesPerLetter, "argument framesPerLetter in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 
		this.textToType = textToType; 
		this.framesPerLetter = framesPerLetter; 

		this.currentIndex = -1
		this.isTyping = true
		this.ready = false
		this.frameCount = 0
		this.completed = () => false


		this.textToType = this.textToType.toString()


		this.localObjects = new LocalObjects([
			new OnTrue(() => this.text == this.textToType, () => {
				setTimeout(() => {
					this.completed = () => true
				}, 1_000)
			})
		])
	}

	update() {
		this.localObjects.update()

		if (this.currentIndex < this.textToType.length && this.frameCount % this.framesPerLetter === 0) {
			this.currentIndex++
		}
		else if (this.currentIndex >= this.textToType.length) {
			this.isTyping = false
		}

		this.frameCount++

	}

	get text() {
		return this.textToType.substring(0, this.currentIndex)
	}


	draw(draw, guiDraw) {
		draw.text(this.position, this.text)
	}


}
