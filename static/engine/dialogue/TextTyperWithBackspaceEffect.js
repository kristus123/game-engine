export class TextTyperWithBackspaceEffect {
	constructor(text) {
		this.t = new TextTyper(text)
		this.t.onFinish = () => {
			setTimeout(() => {
				this.t = new BackspaceEffect(text)
				this.t.onFinish = () => {
					Call(this.onFinish)
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
