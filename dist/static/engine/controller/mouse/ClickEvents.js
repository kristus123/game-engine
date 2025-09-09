import { a } from '/static/engine/assertions/a.js'; 
import { Camera } from '/static/engine/camera/Camera.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 

export class ClickEvents {
	constructor() {


		this.clickHandlers = {}

		document.addEventListener('mousedown', e => this.handleClick(e))
	}

	addOnClick(name, handler) {
		if (!this.clickHandlers[name]) {
			this.clickHandlers[name] = []
		}

		const wrapperHandler = (e) => {
			const mousePosition = Mouse.positionRelativeToCamera(e)
			if (!Mouse.holding && !Mouse.hoveringHtmlElement && !Mouse.disabled) {
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

	handleClick(e) {
		Object.values(this.clickHandlers).flat().forEach(handler => handler(e))
	}
}
