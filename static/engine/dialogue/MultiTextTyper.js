export class MultiTextTyper {
	constructor(position, texts) {
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
		draw.new_text(this.position, this.text)
	}
}
