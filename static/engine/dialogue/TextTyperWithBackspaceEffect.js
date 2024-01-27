export class TextTyperWithBackspaceEffect {
	constructor(text) {
		this.t = new TextTyper(text)
		this.t.onFinish = () => {
			this.t = new BackspaceEffect(text)
		}
	}

	update() {
		this.t.update()
	}

}
