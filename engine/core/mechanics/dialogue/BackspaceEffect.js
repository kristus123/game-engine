export class BackspaceEffect {
	constructor(textToBackspace, framesPerLetter=1) {
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
