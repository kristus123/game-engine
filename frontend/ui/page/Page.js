export class Page {

	static pages = {}

	static init(name, page) {
		this.pages.assertKeyNotPresent(name)
		this.pages[name] = page

		return page
	}

	static go(name) {
		Object.values(this.pages).forEach(p => {
			p.remove()
		})

		Dom.add(this.pages[name])
	}
}
