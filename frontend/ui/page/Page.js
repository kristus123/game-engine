export class Page {

	static pages = {}

	static activeTag = null

	static navigation = Promise.resolve()

	static get active() {
		Assert.value(this.activeTag)
		return this.pages[this.activeTag]
	}

	static init(tag, o) {
		Assert.string(tag)
		Assert.true(tag.endsWith("-page"), `Page component names must end with -page: ${tag}`)
		Assert.object(o)
		o.assertKeyPresent("persistOnClose")
		Assert.bool(o.persistOnClose)
		if Object.hasOwn(o, "layout") {
			Assert.string(o.layout)
		}

		this.pages.assertKeyMissing(tag)
		this.pages[tag] = {
			page: o.persistOnClose ? H.create(tag) : null,
			persistOnClose: o.persistOnClose,
			layout: o.layout ?? null,
			layoutElement: o.persistOnClose && o.layout ? Layout.init(o.layout) : null,
		}
	}

	static open(tag) {
		const navigation = this.navigation.then(() => this._open(tag))
		this.navigation = navigation.catch(() => {})
		return navigation
	}

	static async _open(tag) {
		Assert.string(tag)
		Assert.false(this.activeTag == tag, "can't open same twice")
		this.pages.assertKeyPresent(tag)

		const entry = this.pages[tag]
		if !entry.persistOnClose {
			entry.page = H.create(tag)
			entry.layoutElement = entry.layout ? Layout.init(entry.layout) : null
		}

		if this.activeTag {
			const keepLayout = entry.layoutElement != null && entry.layoutElement == this.active.layoutElement
			await this.close({ keepLayout })
		}

		if entry.layoutElement {
			Layout.attach(entry.layout, entry.page)
			if !entry.layoutElement.isConnected {
				Dom.add(entry.layoutElement)
			}
			entry.layoutOptions = await entry.layoutElement.whenReady()
		}
		else {
			Dom.add(entry.page)
		}
		entry.options = await entry.page.whenReady()
		this.activeTag = tag

		await entry.layoutOptions?.onPageOpen?.()
		await entry.options.onPageOpen?.()
		await entry.options.onToggle?.("open")
	}

	static async close({ keepLayout = false } = {}) {
		const entry = this.active
		await entry.layoutOptions?.onPageClose?.()
		await entry.options.onPageClose?.()
		await entry.options.onToggle?.("close")
		await entry.page.remove()
		if entry.layoutElement && !keepLayout {
			await entry.layoutElement.remove()
		}

		if !entry.persistOnClose {
			entry.page = null
			entry.layoutElement = null
			entry.layoutOptions = null
			entry.options = null
		}
		this.activeTag = null
	}

}
