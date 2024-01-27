export class TextTyperWithBackspaceEffect {
	constructor(text) {
		this.finished = false
		this.t = new TextTyper(text)
		this.t.onFinish = () => {
			setTimeout(() => {
				this.t = new BackspaceEffect(text)
				this.t.onFinish = () => {
					Call(this.onFinish)
					this.finished = true
				}
			}, 900);
		}
	}

	update() {
		this.t.update()
	}

	get text() {
		return this.t.text
	}

}
