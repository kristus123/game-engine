export class Mouse {
	static initialize() {
		this.position = Cam.position.copy()
		this.screenPosition = Cam.position.copy()

		this.disabled = false

		this.up = true
		this.down = false
		this.downStopWatch = new StopWatch()

		this.rightUp = true
		this.rightDown = false

		document.addEventListener('mousemove', (e) => {
			this.position = this.positionRelativeToCamera(e)
		})

		document.addEventListener('mousedown', e => {
			if (this.disabled) {
				return
			}

			if (e.button == 0) {
				this.down = true
				this.up = false
				this.downStopWatch.start()
			}
			else if (e.button == 2) {
				this.rightDown = true
				this.rightUp = false
			}
		})

		document.addEventListener('mouseup', e => {

			if (e.button == 0) {
				this.up = true
				this.down = false
				this.downStopWatch.stop()
				this.downStopWatch.reset()
			}
			else if (e.button == 2) {
				this.rightUp = true
				this.rightDown = false
			}
		})

		document.addEventListener('contextmenu', e => {
			e.preventDefault()
		})

		// Prevent right click to open menu
		// document.addEventListener('contextmenu', event => event.preventDefault())

		this.clickEvents = new ClickEvents()

		this.holding = null
		this.hoveringHtmlElement = false
	}

	static downForLongerThan(ms) {
		return this.down && this.downStopWatch.elapsedTime > ms
	}

	static addOnClick(name, handler) {
		this.clickEvents.addOnClick(name, handler)
	}

	static removeOnClick(name, handler) {
		this.clickEvents.removeOnClick(name, handler)
	}

	static positionRelativeToCamera(e) {
		this.screenPosition.x = e.clientX
		this.screenPosition.y = e.clientY

		// Apply inverse transformations for translation and zoom
		const inverseZoom = 1 /Cam.zoom

		const x =
				(e.clientX - Cam.offset.x) * inverseZoom +
				Cam.position.x
		const y =
				(e.clientY - Cam.offset.y) * inverseZoom +
				Cam.position.y

		return new Position(x, y)
	}

	static clicked(o) {
		return Collision.between(this.position, o) && this.down
	}

	static hovering(o) {
		return Collision.between(this.position, o)
	}

	static update() {
	}

	static draw(draw, guiDraw) {
		// draw.new_circle(this.position)
	}

}
