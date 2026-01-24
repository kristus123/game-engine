export class TextTyperWithBackspaceEffect {
	constructor(_text) {
		this.completed = false
		this.t = TextTyper(_text)
		this.t.onFinish = () => {
			setTimeout(() => {
				this.t = BackspaceEffect(_text)
				this.t.onFinish = () => {
					Call(this.onFinish)
					this.completed = true
				}
			}, 900)
		}
	}

	update() {
		this.t.update()
	}

	draw(draw) {
	}

	get text() {
		return this.t.text
	}


}
