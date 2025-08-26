export class MultiTextTyper {
	constructor(position, texts, onFinish=() => {}) {
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

	draw(draw) {
		draw.text(this.position, this.text)
	}
}
