import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Call } from '/static/engine/code_tools/tools/Call.js'; 

export class BackspaceEffect {
	constructor(textToBackspace, framesPerLetter=1) {

				AssertNotNull(textToBackspace, "argument textToBackspace in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(framesPerLetter, "argument framesPerLetter in " + this.constructor.name + ".js should not be null")
			
		this.textToBackspace = textToBackspace; 
		this.framesPerLetter = framesPerLetter; 

		this.currentIndex = textToBackspace.length
		this.frameCount = 0
	}

	update() {
		if (this.finished) {
			Call(this.onFinish)
		}

		if (this.frameCount % this.framesPerLetter === 0) {
			this.currentIndex--
		}

		this.frameCount++
	}

	get text() {
		return this.textToBackspace.substring(0, this.currentIndex)
	}

	get finished() {
		return this.currentIndex <= 0
	}
}
