// Maybe make it so that there is one central place for all event listeners because right now Dom Mouse and Mouse are both setting up event listeners.
// And I guess it would be very useful to have an easy overview of what event listeners are being used.

export class Mouse {
	// Use DomMouse when you need screen coordinates for ordinary DOM interactions.

	static latest_x = 0
	static latest_y = 0
	static screenX = 0
	static screenY = 0

	static onClick = p => { }

	static position = WorldPosition(0, 0)

	static toRenderCoordinates(clientX, clientY) {
		const bounds = Palette.main.canvas.getBoundingClientRect()
		return {
			x: (clientX - bounds.left) * Palette.width / Math.max(1, bounds.width),
			y: (clientY - bounds.top) * Palette.height / Math.max(1, bounds.height),
		}
	}

	static updateFromClientPosition(clientX, clientY) {
		this.screenX = clientX
		this.screenY = clientY
		const { x, y } = this.toRenderCoordinates(clientX, clientY)
		this.latest_x = x
		this.latest_y = y
		this.updatePosition(x, y)
	}

	static initialize() {
		// is it better to use window.addEventListener ?

		document.addEventListener("wheel", e => {
		})

		// change the pointerdown to use canvas later
		// Instead of listening globally.
		document.addEventListener("pointerdown", e => {
			if UserInput.disabled {
				return
			}

			this.updateFromClientPosition(e.clientX, e.clientY)

			if e.target == Palette.main.canvas {
				this.onClick(this.position)
			}
		})

		document.addEventListener("pointerup", e => {
		})

		document.addEventListener("pointercancel", e => {
		})

		document.addEventListener("contextmenu", e => {
			e.preventDefault()
		})
	}

	static postCameraInitalize() {
		document.addEventListener("pointermove", e => {
			if UserInput.disabled {
				return
			}

			const events = e.getCoalescedEvents()
			const last = events[events.length - 1] || e
			this.updateFromClientPosition(last.clientX, last.clientY)
		})
	}

	static updatePosition(xx, yy) {
		const rotation = Camera.rotationDegrees * Math.PI / 180
		const cosine = Math.cos(rotation)
		const sine = Math.sin(rotation)
		const { x: offsetX, y: offsetY } = Camera.offset
		const zoom = Camera.transformEnabled ? Camera.zoom : 1
		const position = Camera.transformEnabled ? Camera.position : { x: offsetX, y: offsetY }
		const x = xx - offsetX
		const y = yy - offsetY

		this.position.x = (x * cosine + y * sine) / zoom + position.x
		this.position.y = (-x * sine + y * cosine) / zoom + position.y
	}

	static update() {
		if UserInput.disabled {
			return
		}

		this.updatePosition(this.latest_x, this.latest_y)
	}

}
