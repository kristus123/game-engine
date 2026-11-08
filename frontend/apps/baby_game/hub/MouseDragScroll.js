export class MouseDragScroll {

	static horizontal(element, onScroll = null, slide = 0.9) { // allow-null
		if typeof onScroll == "number" {
			slide = onScroll
			onScroll = null
		}
		return new MouseDragScroll(element, "horizontal", onScroll, slide)
	}

	static vertical(element, onScroll = null, slide = 0.9) { // allow-null
		if typeof onScroll == "number" {
			slide = onScroll
			onScroll = null
		}
		return new MouseDragScroll(element, "vertical", onScroll, slide)
	}

	constructor(element, direction, onScroll, slide) { // allow-null
		this.element = element
		this.direction = direction
		this.onScroll = onScroll
		this.slide = slide
		this.dragging = false
		this.velocity = 0
		this.animation = null
		this.lastPosition = 0
		if onScroll != null {
			element.addEventListener("scroll", () => this.notifyScroll())
			this.notifyScroll()
		}

		element.addEventListener("mousedown", e => {
			this.stop()

			this.dragging = true
			this.lastPosition = this.position(e)
			this.velocity = 0
		})

		element.addEventListener("mousemove", e => {
			if !this.dragging {
				return
			}

			const position = this.position(e)
			const delta = position - this.lastPosition

			this.scroll -= delta
			this.velocity = delta
			this.lastPosition = position
		})

		window.addEventListener("mouseup", () => {
			if !this.dragging {
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
		if this.direction == "horizontal" {
			this.element.scrollLeft = value
		}
		else {
			this.element.scrollTop = value
		}
		this.notifyScroll()
	}

	notifyScroll() {
		if this.onScroll == null {
			return
		}

		const scrollX = this.element.scrollLeft
		const scrollY = this.element.scrollTop
		if scrollX == this.lastScrollLeft && scrollY == this.lastScrollTop {
			return
		}

		this.lastScrollLeft = scrollX
		this.lastScrollTop = scrollY
		this.onScroll(scrollX, scrollY)
	}

	animate() {
		if this.dragging || Math.abs(this.velocity) < 0.1 {
			this.animation = null
		}
		else {
			this.scroll -= this.velocity
			this.velocity *= this.slide

			this.animation = requestAnimationFrame(() => this.animate())
		}
	}

	stop() {
		if this.animation != null {
			cancelAnimationFrame(this.animation)
			this.animation = null
		}

		this.velocity = 0
	}
}
