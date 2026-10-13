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
		page.setAttribute("page-name", name)

		const onDomAdd = page._onDomAdd
		const onDomRemove = page._onDomRemove
		let opened = false
		page._onDomAdd = async () => {
			await onDomAdd?.()
			if !page.isConnected || opened {
				return
			}
			this.activePage = page
			this.active = name
			opened = true
			await onOpen?.()
			await onToggle?.("open")
		}
		page._onDomRemove = async () => {
			if this.activePage == page {
				this.activePage = null
				this.active = null
			}
			if opened {
				opened = false
				await onClose?.()
				await onToggle?.("close")
			}
			await onDomRemove?.()
		}

		if page.isConnected {
			Assert.true(this.pages[name] == undefined || this.pages[name] == page, `Page already initialized: ${name}`)
			this.pages[name] = persistOnClose ? page : null
			this.activePage = page
			this.active = name
		}

		return page
	}

	static async open(name) {
		Assert.string(name)
		Assert.true(name.endsWith("-page"), `Page component names must end with -page: ${name}`)
		Assert.value(customElements.get(name))

		const previous = this.activePage
		if this.active == name && previous?.isConnected {
			await previous._lifecyclePromise
			Assert.true(previous.getAttribute("page-name") == name, `${name} must return a page object with persistOnClose`)
			return previous
		}

		const page = this.pages[name] ?? H.create(name)
		previous?.remove()
		this.active = name
		this.activePage = page
		Dom.add(page)
		await page._lifecyclePromise
		Assert.true(page.getAttribute("page-name") == name, `${name} must return a page object with persistOnClose`)
		return page
	}

}
