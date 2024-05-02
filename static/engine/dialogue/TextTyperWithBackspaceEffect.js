export class TextTyperWithBackspaceEffect {
	constructor(_text) {
		this.finished = false
		this.t = new TextTyper(_text)
		this.t.onFinish = () => {
			setTimeout(() => {
				this.t = new BackspaceEffect(_text)
				this.t.onFinish = () => {
					Call(this.onFinish)
					this.finished = true
				}
			}, 900)
		}
	}

	update() {
		this.t.update()
	}

	get text() {
		return this.t.text
	}


}
