// Maybe make it so that there is one central place for all event listeners because right now Dom Mouse and Mouse are both setting up event listeners.
// And I guess it would be very useful to have an easy overview of what event listeners are being used.

export class Mouse {

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

	static initialize() {
		// is it better to use window.addEventListener ?

		document.addEventListener("wheel", e => {
		})

		// change the pointerdown to use canvas later
		// Instead of listening globally.
		document.addEventListener("pointerdown", e => {
			this.screenX = e.clientX
			this.screenY = e.clientY
			const { x, y } = this.toRenderCoordinates(e.clientX, e.clientY)
			Mouse.updatePosition(x, y)

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
			const events = e.getCoalescedEvents()
			const last = events[events.length - 1] || e
			this.screenX = last.clientX
			this.screenY = last.clientY
			const { x, y } = this.toRenderCoordinates(last.clientX, last.clientY)
			this.latest_x = x
			this.latest_y = y
		})
	}

	static updatePosition(xx, yy) {
		const inverseZoom = 1 / Camera.zoom

		const x = (xx - Camera.offset.x) * inverseZoom + Camera.position.x
		const y = (yy - Camera.offset.y) * inverseZoom + Camera.position.y

		this.position.x = x.round()
		this.position.y = y.round()
	}

	static update() {
		this.updatePosition(this.latest_x, this.latest_y)
	}

}
