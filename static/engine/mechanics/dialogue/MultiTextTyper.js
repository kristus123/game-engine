export class MultiTextTyper {
	constructor(position, texts, onFinish=() => {}) {
		this.texts = texts.map(t => new TextTyperWithBackspaceEffect(t))
		this.index = 0

		this.finished = false
	}

	update() {
		if (List.validIndex(this.texts, this.index)) {
			const t = this.texts[this.index]

			if (t.finished) {
				this.index += 1
			}
			else {
				t.update()
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
