export class Layout {
	static references = {}
	static pageSlots = {}

	static register(name) {
		Assert.string(name)
		Assert.value(customElements.get(name), `layout is not a registered custom element: ${name}`)

		const alias = name.split("-")[0]
		Object.defineProperty(this, alias, {
			configurable: true,
			get: () => Assert.value(this.references[name], `layout is not created: ${name}`),
		})
	}

	static init(name) {
		this.register(name)
		if this.references[name] {
			return this.references[name]
		}

		const layout = H.create(name)
		const pageSlot = document.createComment("layout page")
		layout.append(pageSlot)
		this.references[name] = layout
		this.pageSlots[name] = pageSlot

		return layout
	}

	static attach(name, page) {
		this.pageSlots[name].before(page)
	}

}
