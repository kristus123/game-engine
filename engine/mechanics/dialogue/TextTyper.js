export class TextTyper {
	constructor(position, textToType, framesPerLetter=4) {
		this.currentIndex = -1
		this.isTyping = true
		this.ready = false
		this.frameCount = 0
		this.completed = () => false


		this.textToType = this.textToType.toString()


		this.localObjects = LocalObjects([
			OnTrue(() => this.text == this.textToType, () => {
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


	draw(draw) {
		draw.text(this.position, this.text)
	}


}
