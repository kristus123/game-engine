export class Page {

	static pages = {}

	static active = null

	static activePage = null

	static init(page, options) {
		const name = page.tag
		Assert.string(name)
		Assert.true(name.endsWith("-page"), `Page component names must end with -page: ${name}`)
		Assert.object(options)
		Assert.true(Object.hasOwn(options, "persistOnClose"), `${name}: page.persistOnClose is required`)

		const { persistOnClose, onOpen, onClose, onToggle } = options
		Assert.bool(persistOnClose)
		if onOpen != undefined {
			Assert.method(onOpen)
		}
		if onClose != undefined {
			Assert.method(onClose)
		}
		if onToggle != undefined {
			Assert.method(onToggle)
		}

		page.persistOnClose = persistOnClose
		page.onOpen = onOpen
		page.onClose = onClose
		page.onToggle = onToggle
		page.setAttribute("page-name", name)
		Assert.true(this.pages[name] == undefined || this.pages[name] == page, `Page already initialized: ${name}`)
		this.pages[name] = persistOnClose ? page : null

		return page
	}

	static async open(name) {
		Assert.string(name)
		Assert.true(name.endsWith("-page"), `Page component names must end with -page: ${name}`)
		Assert.value(customElements.get(name))

		const previous = this.activePage
		if this.active == name && previous?.isConnected {
			await previous.whenReady()
			Assert.true(previous.getAttribute("page-name") == name, `${name} must return a page object with persistOnClose`)
			return previous
		}

		await this.close()
		const page = this.pages[name] ?? H.create(name)
		this.active = name
		this.activePage = page
		Dom.add(page)
		await page.whenReady()
		Assert.true(page.getAttribute("page-name") == name, `${name} must return a page object with persistOnClose`)
		await page.onOpen?.()
		await page.onToggle?.("open")
		return page
	}


	static async close() {
		const page = this.activePage
		if !page {
			return
		}

		await page.whenReady()
		await page.onClose?.()
		await page.onToggle?.("close")
		page.remove()
		this.activePage = null
		this.active = null
		return page
	}

}
