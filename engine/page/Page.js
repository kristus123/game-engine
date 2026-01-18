export class Page {
	static pages = {}
	static init(page, path) {
		this.pages.assertKeyMissing(page)
		this.pages[path] = page
		page.hide()
		//history.pushState({}, "", path); Todo fix
	}

	static go(page) {
		this.pages.forEach((path, page) => {
    		page.hide()
		})
		page.show()
	}
}