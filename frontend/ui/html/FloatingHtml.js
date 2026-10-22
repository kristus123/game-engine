export class FloatingHtml {
	static {
		this.layer = H.create("overlay-fixed")
		this.layer.style.zIndex = "1000"
		this.layer.style.pointerEvents = "none"
		Dom.add(this.layer)
	}

	static add(e, args={}) {
		Assert.value(e)

		e.style.position = "fixed"
		e.style.pointerEvents = "none"

		e.x = args.x ?? Mouse.screenX
		e.y = args.y ?? Mouse.screenY

		this.layer.append(e)

		e.playAndRemove("move-up")

		return e
	}
}
