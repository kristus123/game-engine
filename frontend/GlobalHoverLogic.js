export class GlobalHoverLogic {
	constructor() {
		this.observedElements = new WeakSet()
	}

	async notify(origin, hovering) {
		let page = origin.parentElement
		while (page && !page.tag.endsWith("-page")) {
			page = page.parentElement
		}
		if !page {
			return
		}

		const options = await page.whenReady()
		options.onHover?.[origin.id]?.({ origin, hovering })
	}

	inject(origin) {
		if !origin.id || this.observedElements.has(origin) {
			return
		}

		this.observedElements.add(origin)
		origin.addEventListener("mouseenter", () => {
			this.notify(origin, true)
		})
		origin.addEventListener("mouseleave", () => {
			this.notify(origin, false)
		})
	}
}
