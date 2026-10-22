export class FloatingHtml {
	static {
		this.layer = H.create("overlay-fixed")
		this.layer.style.zIndex = "1000"
		this.layer.style.pointerEvents = "none"
		Dom.add(this.layer)
	}

	static add(popup, options={}) {
		Assert.value(popup)

		const x = options.x ?? Mouse.screenX
		const y = options.y ?? Mouse.screenY

		popup.style.position = "fixed"
		popup.style.left = `${x}px`
		popup.style.top = `${y}px`

		this.layer.append(popup)
		popup.play("move-up", {
			onEnd: () => popup.remove(),
		})
		return popup
	}
}
