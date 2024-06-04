export class ClickEvents {
	constructor() {
		this.clickHandlers = {}

		this.handleClick = this.handleClick.bind(this)
		document.addEventListener('click', this.handleClick)
	}

	addOnClick(name, handler) {
		if (!this.clickHandlers[name]) {
			this.clickHandlers[name] = []
		}

		const wrapperHandler = (e) => {
			const mousePosition = Mouse.positionRelativeToCamera(e)
			if (!Mouse.holding) {
				handler(mousePosition)
			}
		}

		this.clickHandlers[name].push(wrapperHandler)
	}

	removeOnClick(name, handler) {
		const handlers = this.clickHandlers[name]

		if (handlers) {
			const index = handlers.indexOf(handler)
			if (index !== -1) {
				handlers.splice(index, 1)
			}
		}
	}

	handleClick(event) {
		Object.values(this.clickHandlers).flat().forEach(handler => handler(event))
	}
}
