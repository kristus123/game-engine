export class Mouse {
	static position = Camera.position.copy()
	static screenPosition = Camera.position.copy()

	static down = false
	static mouseLastMoved = 0


	// Prevent right click to open menu
	// document.addEventListener('contextmenu', event => event.preventDefault())

	static clickEvents = new ClickEvents(this)

	static holding = null

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
		const inverseZoom = 1 /Camera.zoom

		const x =
				(e.clientX - Camera.offset.x) * inverseZoom +
				Camera.position.x
		const y =
				(e.clientY - Camera.offset.y) * inverseZoom +
				Camera.position.y

		return new Position(x, y)
	}

	static clicked(o) {
		return Collision.between(this.position, o) && this.down
	}

	static hovering(o) {
		return Collision.between(this.position, o)
	}
}

document.addEventListener('mousemove', (e) => {
	Mouse.mouseLastMoved = 0
	Mouse.position = Mouse.positionRelativeToCamera(e)
})

document.addEventListener('mousedown', () => {
	Mouse.down = true
	Mouse.up = false
})

document.addEventListener('mouseup', () => {
	Mouse.up = true
	Mouse.down = false
})