export class Page {

	static pages = []

	static init(page) {
		this.pages.assertNotPresent(page)
		this.pages.add(page)

		//history.pushState({}, "", path); Todo fix when needed

		return page
	}

	static go(page) {
		this.pages.forEach(p => {
			p.remove()
		})

		Dom.add(page)
	}
}
