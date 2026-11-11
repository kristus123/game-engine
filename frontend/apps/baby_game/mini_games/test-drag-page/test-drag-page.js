const watchedKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyW", "KeyA", "KeyS", "KeyD"]

function keyboardState() {
	const pressed = []
	if Keyboard.up {
		pressed.push("↑ / W")
	}
	if Keyboard.down {
		pressed.push("↓ / S")
	}
	if Keyboard.left {
		pressed.push("← / A")
	}
	if Keyboard.right {
		pressed.push("→ / D")
	}
	return pressed.length ? pressed.join(", ") : "none"
}

function updateKeyboardStatus(html) {
	html.keyboardStatus.textContent = "Keyboard: " + keyboardState()
}

export default {
	page: {
		persistOnClose: false,
	},
	fields: () => ({
		keyDown: null,
		keyUp: null,
		previousDragHandlers: null,
	}),
	onDomAdd: ({ html }) => {
		html.fields.previousDragHandlers = {
			onDrag: DomMouse.onDrag,
			whileDragging: DomMouse.whileDragging,
			onDrop: DomMouse.onDrop,
		}
		DomMouse.onDrag = item => {
			html.dragStatus.textContent = "Drag: holding " + item.textContent.trim()
		}
		DomMouse.whileDragging = item => {
			html.dragStatus.textContent = "Drag: moving (keyboard still active)"
			if html.dragList.contains(item) {
				html.dragList.orderBasedOnMousePosition(item)
			}
		}
		DomMouse.onDrop = () => {
			html.dragStatus.textContent = "Drag: released"
		}

		html.fields.keyDown = event => {
			if watchedKeys.includes(event.code) {
				updateKeyboardStatus(html)
			}
		}
		html.fields.keyUp = event => {
			if watchedKeys.includes(event.code) {
				updateKeyboardStatus(html)
			}
		}
		window.addEventListener("keydown", html.fields.keyDown)
		window.addEventListener("keyup", html.fields.keyUp)
	},
	onDomRemove: ({ html }) => {
		window.removeEventListener("keydown", html.fields.keyDown)
		window.removeEventListener("keyup", html.fields.keyUp)
		Object.assign(DomMouse, html.fields.previousDragHandlers)
		html.fields.keyDown = null
		html.fields.keyUp = null
		html.fields.previousDragHandlers = null
	},
}
