export class Mouse {
	constructor(camera) {
		this.camera = camera

		this.position = new Position(0, 0)

		this.down = false

		document.addEventListener('mousemove', (e) => {
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

		this.clickEvents = new ClickEvents(this)
	}

	addOnClick(name, handler) {
		this.clickEvents.addOnClick(name, handler)
	}

	removeOnClick(name, handler) {
		this.clickEvents.removeOnClick(name, handler)
	}

	positionRelativeToCamera(e) {
		// Apply inverse transformations for translation and zoom
		const inverseZoom = 1 / this.camera.zoom

		const x = 	
				(e.clientX - this.camera.offset.x) * inverseZoom +
				this.camera.objectToFollow.x
		const y = 	
				(e.clientY - this.camera.offset.y) * inverseZoom +
				this.camera.objectToFollow.y

		return new Position(x, y)

	}
}
