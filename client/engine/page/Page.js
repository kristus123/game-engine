export class Page {

	static pages = []

	static init(page) {
		this.pages.assertNotPresent(page)
		this.pages.add(page)

		Dom.overlay(page)
		page.hide()
		//history.pushState({}, "", path); Todo fix when needed

		return page
	}

	static go(page) {
		this.pages.forEach(p => {
			p.hide()
		})

		page.show()
	}
}
