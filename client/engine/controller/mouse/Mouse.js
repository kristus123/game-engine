export class Mouse {

	static latest_x = 0
	static latest_y = 0

	static onClick = p => {}

	static position = WorldPosition(0, 0)
	static screenPosition = WorldPosition(0, 0)

	static initialize() {
		document.addEventListener("wheel", e => {
		})

		document.addEventListener("pointerdown", e => {
			Mouse.updatePosition(e.clientX, e.clientY)

			if (e.target == Palette.main.canvas) { // not sure if this works
				this.onClick(this.position)
			}
		})

		document.addEventListener("pointerup", e => {
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
		this.screenPosition.x = xx.round()
		this.screenPosition.y = yy.round()

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
