export class Mouse {

	static latest_x = 0
	static latest_y = 0

	static onClick = p => {}

	static onDomClick = p => {
		console.log(p)
	}

	static position = WorldPosition(0, 0)
	static screen = WorldPosition(0, 0)

	static initialize() {
		// is it better to use window.addEventListener

		document.addEventListener("wheel", e => {
		})

		document.addEventListener("pointerdown", e => {
			Mouse.updatePosition(e.clientX, e.clientY)

			if (e.target == Palette.main.canvas) { // not sure if this works
				this.onClick(this.position)
			}
			else {
				this.onDomClick(e.target)
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
		this.screen.x = xx
		this.screen.y = yy

		const inverseZoom = 1 / Camera.zoom

		const x = (xx - Camera.offset.x) * inverseZoom + Camera.position.x
		const y = (yy - Camera.offset.y) * inverseZoom + Camera.position.y

		this.position.x = x.round()
		this.position.y = y.round()
	}

	static update() {
		this.updatePosition(this.latest_x, this.latest_y)
	}

	static drawCursor() {
		// Draw directly on main canvas without any transformation
		const ctx = Palette.main.ctx
		ctx.beginPath()
		ctx.arc(this.screen.x, this.screen.y, 10, 0, Math.PI * 2, false)
		ctx.fillStyle = "red"
		ctx.fill()
	}

}
