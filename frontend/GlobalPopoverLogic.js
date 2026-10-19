export class GlobalPopoverLogic {
	constructor() {
		this.anchorIndex = 0
		this.anchors = new WeakMap()
		this.observedElements = new WeakSet()
	}

	isPopover(target) {
		return target.tag == "pop-over" || target.hasAttribute("popover")
	}

	parseClickShow(value) {
		const [id, ...options] = value.trim().split(/\s+/)
		for const option of options {
			Assert.either(option, ["alwaysShow"])
		}
		return { id, alwaysShow: options.includes("alwaysShow") }
	}

	getTarget(id) {
		return Assert.value(
			document.getElementById(id),
			`target not found: ${id}`,
		)
	}

	getPopover(id) {
		const popover = this.getTarget(id)
		Assert.true(
			this.isPopover(popover),
			`popover target must be a <pop-over> or have the popover attribute: ${id}`,
		)
		return popover
	}

	anchor(origin) {
		if !this.anchors.has(origin) {
			this.anchors.set(origin, `--global-popover-${this.anchorIndex++}`)
		}
		const anchorName = this.anchors.get(origin)
		origin.style.setProperty("anchor-name", anchorName)
		return anchorName
	}

	open(popover, origin, mode, alwaysShow=false) {
		const anchorName = this.anchor(origin)
		if popover.tag == "pop-over" {
			popover.open({ origin, mode, alwaysShow })
		}
		else if !popover.matches(":popover-open") {
			popover.style.setProperty("position-anchor", anchorName)
			if mode == "click" {
				popover.setAttribute("popover", alwaysShow ? "manual" : "auto")
			}
			popover.showPopover()
		}
	}

	close(popover, origin, mode) {
		if popover.tag == "pop-over" {
			popover.close({ origin, mode })
		}
		else if popover.matches(":popover-open") {
			popover.hidePopover()
		}
	}

	showTarget(target, origin, alwaysShow=false) {
		if this.isPopover(target) {
			this.open(target, origin, "click", alwaysShow)
			return
		}
		Assert.false(alwaysShow)
		if target.tag == "dialog" {
			target.showModal()
		}
		else {
			target.show()
		}
	}

	hideTarget(target) {
		if target.tag == "pop-over" {
			target.dismiss()
			return
		}
		if target.hasAttribute("popover") {
			if target.matches(":popover-open") {
				target.hidePopover()
			}
			return
		}
		if target.tag == "dialog" {
			target.close()
		}
		else {
			target.hide()
		}
	}

	bindClickShow(origin) {
		if !origin.hasAttribute("on-click-show") {
			return
		}
		const value = origin.getAttribute("on-click-show")
		const config = value ? this.parseClickShow(value) : null
		origin.addEventListener("click", () => {
			const target = config ? this.getTarget(config.id) : origin
			this.showTarget(target, origin, config?.alwaysShow ?? false)
		})
	}

	bindClickHide(origin) {
		if !origin.hasAttribute("on-click-hide") {
			return
		}
		const id = origin.getAttribute("on-click-hide")
		origin.addEventListener("click", () => {
			this.hideTarget(id ? this.getTarget(id) : origin)
		})
	}

	bindHoverShow(origin) {
		const id = origin.getAttribute("on-hover-show")
		if !id {
			return
		}

		this.anchor(origin)
		origin.addEventListener("mouseenter", () => {
			this.open(this.getPopover(id), origin, "hover")
		})
		origin.addEventListener("mouseleave", () => {
			this.close(this.getPopover(id), origin, "hover")
		})
	}

	inject(origin) {
		const relevant = origin.hasAttribute("on-click-show")
			|| origin.hasAttribute("on-click-hide")
			|| origin.hasAttribute("on-hover-show")
		if !relevant || this.observedElements.has(origin) {
			return
		}

		this.observedElements.add(origin)
		this.bindClickShow(origin)
		this.bindClickHide(origin)
		this.bindHoverShow(origin)
	}
}
