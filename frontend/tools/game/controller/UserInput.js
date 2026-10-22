function _overlay() {
	const overlay = document.createElement("div")
	overlay.className = "user-input-overlay"
	overlay.setAttribute("hidden", "")
	overlay.style.position = "fixed"
	overlay.style.inset = "0"
	overlay.style.zIndex = "2147483647"
	overlay.style.pointerEvents = "auto"
	document.body.appendChild(overlay)

	return overlay
}

export class UserInput {

	static disabled = false

	static {
		this.overlay = _overlay()
	}

	static enable() {
		this.disabled = false

		if this.overlay != null {
			this.overlay.hide()
		}
	}

	static disable() {
		this.disabled = true
		this.overlay.show()
	}

}
