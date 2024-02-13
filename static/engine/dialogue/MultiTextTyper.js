export class MultiTextTyper {
	constructor(texts) { // IGNORE -- make it so that if u declare this.texts, it will not automatically add it
		this.texts = texts.map(t => new TextTyperWithBackspaceEffect(t))
		this.index = 0
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
	}

	get text() {
		if (List.validIndex(this.texts, this.index)) {
			return this.texts[this.index].text
		}
		else {
			return ''
		}
	}

}
