export class Layout {
	static references = {}

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
		const layout = H.create(name)
		this.references[name] = layout

		return layout
	}

}
