export class Mouse {
	static initialize(camera) {
		this.camera = camera
		this.position = Cam.position.copy()
		this.screenPosition = Cam.position.copy()

		this.down = false
		this.mouseLastMoved = 0

		document.addEventListener('mousemove', (e) => {
			this.mouseLastMoved = 0
			this.position = this.positionRelativeToCamera(e)
		})

		document.addEventListener('mousedown', () => {
			this.down = true
			this.up = false
		})

		document.addEventListener('mouseup', () => {
			this.up = true
			this.down = false
		})

		// Prevent right click to open menu
		// document.addEventListener('contextmenu', event => event.preventDefault())

		this.clickEvents = new ClickEvents(this)

		this.holding = null
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
}
