export class DomMouse { // Maybe rename to UI Mouse.

	static onDrag = () => {}
	static onDrop = () => {}
	static whileDragging = () => {}
	static onMouseMove = () => {}

	static draggedItem = null

	static {
		window.addEventListener("pointerdown", e => {
			this.draggedItem = e.target.closest("[draggable]")

			if (this.draggedItem) {
				this.onDrag?.(this.draggedItem)

				this.draggedItem.style.opacity = "0.5"
				e.target.setPointerCapture(e.pointerId)

				this.draggedItem.addAttribute("being-dragged") // only one element should have attribute 'being-dragged' at any given time
			}
		})

		window.addEventListener("pointermove", e => {
			if (this.draggedItem) {
				this.whileDragging?.(this.draggedItem)
			}

			this.onMouseMove?.(e.target)
		})

		const stopDrag = () => {
			if (this.draggedItem) {
				this.draggedItem.removeAttribute("being-dragged")
				this.draggedItem.style.opacity = "1"

				this.onDrop?.(this.draggedItem)
				this.draggedItem = null
			}
		}

		window.addEventListener("pointerup", e => stopDrag())
		window.addEventListener("pointercancel", () => stopDrag())
	}

	// right now I'm not sure how I want to do it.
	// If a floating element it should probably ignore the floating element or maybe not.
	static get hovering() {
		return document.elementsFromPoint(Mouse.screen.x, Mouse.screen.y)
	}
}
