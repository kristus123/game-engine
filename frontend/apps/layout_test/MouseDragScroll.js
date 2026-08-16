export class MouseDragScroll {
	static horizontal(element, slide = 0.9) {
		return new MouseDragScroll(element, "horizontal", slide)
	}

	static vertical(element, slide = 0.9) {
		return new MouseDragScroll(element, "vertical", slide)
	}

	constructor(element, direction, slide) {
		this.element = element
		this.direction = direction
		this.slide = slide
		this.dragging = false
		this.velocity = 0
		this.animation = null
		this.lastPosition = 0

		element.addEventListener("mousedown", e => {
			this.stop()

			this.dragging = true
			this.lastPosition = this.position(e)
			this.velocity = 0
		})

		element.addEventListener("mousemove", e => {
			if (!this.dragging) {
				return
			}

			const position = this.position(e)
			const delta = position - this.lastPosition

			this.scroll -= delta
			this.velocity = delta
			this.lastPosition = position
		})

		window.addEventListener("mouseup", () => {
			if (!this.dragging) {
				return
			}

			this.dragging = false
			this.animate()
		})

		element.addEventListener("wheel", () => {
			this.stop()
		})
	}

	position(e) {
		return this.direction == "horizontal" ? e.clientX : e.clientY
	}

	get scroll() {
		return this.direction == "horizontal"
			? this.element.scrollLeft
			: this.element.scrollTop
	}

	set scroll(value) {
		if (this.direction == "horizontal") {
			this.element.scrollLeft = value
		}
		else {
			this.element.scrollTop = value
		}
	}

	animate() {
		if (this.dragging || Math.abs(this.velocity) < 0.1) {
			this.animation = null
			return
		}

		this.scroll -= this.velocity
		this.velocity *= this.slide

		this.animation = requestAnimationFrame(() => this.animate())
	}

	stop() {
		if (this.animation != null) {
			cancelAnimationFrame(this.animation)
			this.animation = null
		}

		this.velocity = 0
	}
}
