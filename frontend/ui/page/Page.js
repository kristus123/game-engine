export class Page {

	static pages = {}

	static activeTag = null

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

		this.pages.assertKeyMissing(tag)
		this.pages[tag] = {
			page: o.persistOnClose ? H.create(tag) : null,
			persistOnClose: o.persistOnClose,
		}
	}

	static async open(tag) {
		Assert.string(tag)
		Assert.false(this.activeTag == tag, "can't open same twice")
		this.pages.assertKeyPresent(tag)

		if this.activeTag {
			await this.close()
		}

		const entry = this.pages[tag]
		if !entry.persistOnClose {
			entry.page = H.create(tag)
		}

		Dom.add(entry.page)
		entry.options = await entry.page.whenReady()
		this.activeTag = tag

		await entry.options.onPageOpen?.()
		await entry.options.onToggle?.("open")
	}

	static async close() {
		const entry = this.active
		await entry.options.onPageClose?.()
		await entry.options.onToggle?.("close")
		entry.page.remove()

		if !entry.persistOnClose {
			entry.page = null
			entry.options = null
		}
		this.activeTag = null
	}

}
