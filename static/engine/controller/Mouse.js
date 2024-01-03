export class Mouse {
	constructor(camera) {
		this.camera = camera

		this.position = camera.position.copy()
		this.screenPosition = camera.position.copy()

		this.down = false
		this.mouseLastMoved = 0

		document.addEventListener('mousemove', (e) => {
			this.mouseLastMoved = 0
			this.position = this.positionRelativeToCamera(e)
		})

		setInterval(() => {
			this.mouseLastMoved += 1
			if (this.mouseLastMoved > 10) {
				this.position.x = this.camera.position.x - Palette.width + this.screenPosition.x + (Palette.width/2)
				this.position.y = this.camera.position.y - Palette.height + this.screenPosition.y + (Palette.height/2)
			}
		}, 1)

		document.addEventListener('mousedown', () => {
			this.down = true
			this.up = false
		})

		document.addEventListener('mouseup', () => {
			this.up = true
			this.down = false
		})

		this.clickEvents = new ClickEvents(this)
	}

	addOnClick(name, handler) {
		this.clickEvents.addOnClick(name, handler)
	}

	removeOnClick(name, handler) {
		this.clickEvents.removeOnClick(name, handler)
	}

	positionRelativeToCamera(e) {
		this.screenPosition.x = e.clientX
		this.screenPosition.y = e.clientY

		// Apply inverse transformations for translation and zoom
		const inverseZoom = 1 / this.camera.zoom

		const x =
				(e.clientX - this.camera.offset.x) * inverseZoom +
				this.camera.position.x
		const y =
				(e.clientY - this.camera.offset.y) * inverseZoom +
				this.camera.position.y

		return new Position(x, y)

	}

	hovering(o) {
		return Collision.between(this.position, o)
	}

	clicking(o) {
		return Collision.between(this.position, o) && this.down
	}
}
