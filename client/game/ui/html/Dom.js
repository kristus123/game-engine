export class Dom {

	static onDrag = () => {}
	static onDrop = () => {}
	static whileDragging = () => {}
	static onMouseMove = () => {}

	static {
		let draggedItem = null

		window.addEventListener("pointerdown", e => {
			draggedItem = e.target.closest("[draggable]")

			if (draggedItem) {
				//this.whileDragging?.(draggedItem)
				this.onDrag?.(draggedItem)

				draggedItem.style.opacity = "0.5"
				e.target.setPointerCapture(e.pointerId)

				draggedItem.addAttribute("being-dragged") // only one element should have attribute 'being-dragged' at any given time
			}
		})

		window.addEventListener("pointermove", e => {
			if (draggedItem) {
				this.whileDragging?.(draggedItem)
			}

			this.onMouseMove?.(e)
		})

		const stopDrag = () => {
			if (draggedItem) {
				draggedItem.removeAttribute("being-dragged")
				draggedItem.style.opacity = "1"

				//this.whileDragging?.(draggedItem)
				this.onDrop?.(draggedItem)
				draggedItem = null
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
}
