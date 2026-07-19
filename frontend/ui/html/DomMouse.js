export class DomMouse { // Maybe rename to UI Mouse? not sure

	static position = WorldPosition(0, 0)

	static onDrag = () => {}
	static onDrop = () => {}
	static whileDragging = () => {}
	static onMove = () => {}

	static draggedItem = null

	static {
		window.addEventListener("pointerdown", e => {
			this.draggedItem = e.target.closest("[draggable]")

			if (this.draggedItem != null) {
				this.onDrag?.(this.draggedItem)

				this.draggedItem.style.opacity = "0.5"
				e.target.setPointerCapture(e.pointerId)

				this.draggedItem.addAttribute("being-dragged") // todo: only one element should have attribute 'being-dragged' at any given time, add asserts etc
			}
		})

		window.addEventListener("pointermove", e => {
			this.position.x = e.clientX
			this.position.y = e.clientY

			if (this.draggedItem != null) {
				this.whileDragging?.(this.draggedItem)
			}

			this.onMove?.(this.position.x, this.position.y)
		})

		const stopDragging = () => {
			if (this.draggedItem != null) {
				this.draggedItem.removeAttribute("being-dragged")
				this.draggedItem.style.opacity = "1"

				this.onDrop?.(this.draggedItem)
				this.draggedItem = null
			}
		}

		window.addEventListener("pointerup", e => stopDragging())
		window.addEventListener("pointercancel", () => stopDragging())
	}

	static get x() {
		return this.position.x
	}

	static get y() {
		return this.position.y
	}

	// right now I'm not sure how I want to do it.
	// If a floating element it should probably ignore the floating element or maybe not.
	// find better solution for this
	static get hovering() {
		return document.elementsFromPoint(this.position.x, this.position.y)
	}
}
