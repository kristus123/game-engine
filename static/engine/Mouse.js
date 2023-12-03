export class Mouse {
	constructor(camera) {
		this.camera = camera

		this.position = {
			x: 0,
			y: 0,
		}

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

		return {
			x:
				(e.clientX - this.camera.offset.x) * inverseZoom +
				this.camera.objectToFollow.x,
			y:
				(e.clientY - this.camera.offset.y) * inverseZoom +
				this.camera.objectToFollow.y,
		}
	}
}
