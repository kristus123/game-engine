export class Page {

	static pages = {}

	static active = null

	static init(name, page) {
		this.pages.assertKeyNotPresent(name)

		page.setAttribute("page-name", name) // is this needed?

		this.pages[name] = page

		return page
	}

	static go(name) {
		this.pages[this.active].remove()

		Dom.add(this.pages[name])
		this.active = name
	}

}
