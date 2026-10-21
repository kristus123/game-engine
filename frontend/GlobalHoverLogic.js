export class GlobalHoverLogic {
	constructor() {
		this.observedElements = new WeakSet()
	}

	async notify(origin, type) {
		let page = origin.parentElement
		while (page && !page.tag.endsWith("-page")) {
			page = page.parentElement
		}
		if !page {
			return
		}

		const options = await page.whenReady()
		options[`onHover${type}`]?.[origin.id]?.({ origin })
	}

	inject(origin) {
		if !origin.id || this.observedElements.has(origin) {
			return
		}

		this.observedElements.add(origin)
		origin.addEventListener("mouseenter", () => {
			this.notify(origin, "Show")
		})
		origin.addEventListener("mouseleave", () => {
			this.notify(origin, "Hide")
		})
	}
}
