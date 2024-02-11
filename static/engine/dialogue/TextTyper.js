export class TextTyper {
	constructor(textToType, framesPerLetter) {
		this.textToType = textToType
		this.currentIndex = -1
		this.isTyping = true
		this.ready = false
		this.framesPerLetter = framesPerLetter || 4
		this.frameCount = 0
		this.finishedTyping = false
	}

	update() {
		RunOnce(this.text == this.textToType, () => {
			Call(this.onFinish)
			this.finishedTyping = true
			return
		})

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
}
