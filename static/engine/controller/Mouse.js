export class Mouse {
	constructor(camera) {
		this.position = camera.position.copy()
		this.screenPosition = camera.position.copy()

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

	clicked(o) {
		return Collision.between(this.position, o) && this.down
	}

	holdingO(o) {
		if (!this.holding) {
			if (Collision.between(this.position, o) && this.down) {
				this.holding = o
				return true
			}
		}
		else if (o === this.holding) {
			return true
		}

		if (this.holding && this.up) {
			this.holding = null
			return false
		}
	}

	moveIf(o) {
		if (!this.holding) {
			if (Collision.between(this.position, o) && this.down) {
				this.holding = o
			}
		}
		else if (o === this.holding) {
			o.position.center.x = this.position.x
			o.position.center.y = this.position.y
		}

		if (this.holding && this.up) {
			this.holding = null
		}
	}
}
