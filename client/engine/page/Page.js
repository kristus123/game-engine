export class Page {

	static pages = []

	static init(page) {
		this.pages.assertNotPresent(page)
		this.pages.add(page)

		page.hide()
		//history.pushState({}, "", path); Todo fix when needed
	}

	static go(page) {
		this.pages.forEach(page => {
			page.hide()
		})

		page.show()
	}
}
