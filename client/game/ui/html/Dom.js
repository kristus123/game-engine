export class Dom {

	static onDrag = () => {}
	static onDrop = () => {}
	static whileDragging = () => {}
	static onMouseMove = () => {}

	static draggedItem = null

	static {
		window.addEventListener("pointerdown", e => {
			this.draggedItem = e.target.closest("[draggable]")

			if (this.draggedItem) {
				//this.whileDragging?.(this.draggedItem)
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

				//this.whileDragging?.(this.draggedItem)
				this.onDrop?.(this.draggedItem)
				this.draggedItem = null
			}
		}

		window.addEventListener("pointerup", e => stopDrag())
		window.addEventListener("pointercancel", () => stopDrag())
	}

	static overlay(e) {
		Assert.notList(e) // do Assert.htmlElement instead in the future

		e.addClass("overlay")

		document.body.appendChild(e)

		return e
	}

	static floating(e) {
		Assert.notList(e) // do Assert.htmlElement instead in the future

		e.addClass("floating")

		document.body.appendChild(e)

		return e
	}

	static add(e) { // should this add itself to an overlay? i guess that would make sense. this is for easy debugging and not for proper layouts
		Assert.notList(e) // do Assert.htmlElement instead in the future

		if (e.isConnected) {
			throw new Error("use .move if element is already in dom")
		}
		else {
			document.body.appendChild(e)
			return e
		}
	}

	static move(e) {
		Assert.notList(e) // do Assert.htmlElement instead in the future

		if (e.isConnected) {
			document.body.appendChild(e)
			return this
		}
		else {
			throw new Error("element must be added in dom before it can be moved")
		}
	}

	static remove(e) {
		Assert.notList(e) // do Assert.htmlElement instead in the future

		if (e.isConnected) {
			document.body.removeChild(e)
		}
		else {
			throw new Error("element is not in Dom")
		}
	}

	static swapBody(elements) {
		const newBody = document.createElement("body")

		for (const e of Always.list(elements)) {
			newBody.append(e)
		}

		document.body.parentNode.replaceChild(newBody, document.body)
	}

	// right now I'm not sure how I want to do it, if a floating element it should probably ignore the floating element or maybe not. I am not sure how to solve this
	static get hovering() {
		for (const e of document.elementsFromPoint(Mouse.screen.x, Mouse.screen.y)) {
			console.log(e)
			return e
		}
	}
}
