// Maybe make it so that there is one central place for all event listeners because right now Dom Mouse and Mouse are both setting up event listeners.
// And I guess it would be very useful to have an easy overview of what event listeners are being used.

export class Mouse {

	static latest_x = 0
	static latest_y = 0

	static onClick = p => {}

	static position = WorldPosition(0, 0)

	static initialize() {
		// is it better to use window.addEventListener ?

		document.addEventListener("wheel", e => {
		})

		// change the pointerdown to use canvas later
		// Instead of listening globally.
		document.addEventListener("pointerdown", e => {
			Mouse.updatePosition(e.clientX, e.clientY)

			if (e.target == Palette.main.canvas) {
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

	static initializeAfterCameraIsInitialized() {
		document.addEventListener("pointermove", e => {
			const events = e.getCoalescedEvents()

			const last = events[events.length - 1]
			this.latest_x = last.clientX
			this.latest_y = last.clientY
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
		D1.circle(this.position)
	}

}
