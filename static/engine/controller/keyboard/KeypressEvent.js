export class KeypressEvent {
	constructor() {
		this.keyDownHandlers = {}
		this.keyUpHandlers = {}
		this.keyState = {}

		document.addEventListener('keydown', this.handleKeyDown.bind(this))
		document.addEventListener('keyup', this.handleKeyUp.bind(this))
	}

	addKeyDownListener(key, execute) {
		this.keyDownHandlers[key] = execute
	}

	addKeyUpListener(key, execute) {
		this.keyUpHandlers[key] = execute
	}

	handleKeyDown(event) {
		const key = event.key

		if (!this.keyState[key]) {
			this.keyState[key] = true

			if (this.keyDownHandlers[key]) {
				this.keyDownHandlers[key]()
			}
		}

		console.log('Currently pressed key: ' + key); // space is just ' '
	}

	handleKeyUp(event) {
		const key = event.key
		this.keyState[key] = false

		if (this.keyUpHandlers[key]) {
			this.keyUpHandlers[key]()
		}
	}
}
