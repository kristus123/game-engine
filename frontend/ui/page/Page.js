export class Page {

	static pages = {}

	static visiblePages = []

	static navigation = Promise.resolve()

	static get activeTag() {
		return this.visiblePages.empty ? null : this.visiblePages.last.tag
	}

	static get active() {
		Assert.value(this.activeTag)
		return this.pages[this.activeTag]
	}

	static init(tag, o) {
		Assert.string(tag)
		Assert.true(tag.endsWith("-page"), `Page component names must end with -page: ${tag}`)

		Assert.object(o)
		Assert.bool(o.persistOnClose)
		o.assertKeyPresent("persistOnClose")

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
		const navigation = this.navigation.then(() => this._transition(async () => {
			Assert.string(tag)
			this.pages.assertKeyPresent(tag)

			const entry = this.pages[tag]
			const layoutElement = entry.layout ? Layout.init(entry.layout) : null

			while (this.visiblePages.length > 0) {
				const visiblePage = this.visiblePages.last
				if visiblePage.isOverlay {
					await this._closeOverlay()
				}
				else {
					const keepLayout = layoutElement != null && layoutElement == visiblePage.layoutElement
					await this._close({ keepLayout })
				}
			}

			for const oldLayout of Object.values(Layout.references) {
				if oldLayout.isConnected && oldLayout != layoutElement {
					await oldLayout.remove()
					await oldLayout.whenLifecycleReady()
				}
			}

			if !entry.persistOnClose {
				entry.page = H.create(tag)
				entry.layoutElement = layoutElement
			}

			if entry.layoutElement {
				Layout.attach(entry.layout, entry.page)
				if !entry.layoutElement.isConnected {
					Dom.add(entry.layoutElement)
				}
				await entry.layoutElement.whenReady()
				await entry.layoutElement.whenLifecycleReady()
			}
			else {
				Dom.add(entry.page)
			}

			entry.options = await entry.page.whenReady()
			this.visiblePages.push({ tag, isOverlay: false, layoutElement: entry.layoutElement })
			await entry.page.whenLifecycleReady()

			await entry.options.onToggle?.("open")
		}))

		this.navigation = navigation.catch(() => {})

		return navigation
	}

	static openAsCustomModal(tag) {
		const navigation = this.navigation.then(() => this._transition(() => this._openOverlay(tag)))
		this.navigation = navigation.catch(() => {})
		return navigation
	}

	static async _openOverlay(tag) {
		Assert.string(tag)
		this.pages.assertKeyPresent(tag)
		Assert.false(this.visiblePages.some(visiblePage => visiblePage.tag == tag), "page is already visible")

		const entry = this.pages[tag]
		Assert.false(entry.layoutElement != null || entry.layout != null, "pages with a shared layout cannot open as custom overlays")

		if !entry.persistOnClose {
			entry.page = H.create(tag)
		}

		const wrapper = document.createElement("overlay-fixed")
		wrapper.append(entry.page)
		const layoutElement = this.visiblePages.empty ? null : this.visiblePages.last.layoutElement
		this.visiblePages.push({ tag, isOverlay: true, wrapper, layoutElement })

		try {
			Dom.add(wrapper)
			entry.options = await entry.page.whenReady()
			await entry.page.whenLifecycleReady()
			await entry.options.onToggle?.("open")
		}
		catch (error) {
			try {
				await entry.page.remove()
			}
			catch {}
			try {
				await entry.page.whenLifecycleReady()
			}
			catch {}
			wrapper.remove()
			this.visiblePages.pop()
			if !entry.persistOnClose {
				entry.page = null
				entry.options = null
			}
			throw error
		}
	}

	static async _transition(action) {
		UserInput.disable()

		try {
			return await action()
		}
		finally {
			UserInput.enable()
		}
	}

	static async close({ keepLayout = false } = {}) {
		return this._transition(async () => {
			Assert.false(this.visiblePages.empty, "no page is active")
			const visiblePage = this.visiblePages.last
			if visiblePage.isOverlay {
				return this._closeOverlay()
			}
			return this._close({ keepLayout })
		})
	}

	static async _closeOverlay() {
		Assert.false(this.visiblePages.empty, "no custom overlay is open")
		const visiblePage = this.visiblePages.last
		Assert.true(visiblePage.isOverlay, "the active page is not a custom overlay")
		const entry = this.pages[visiblePage.tag]
		await entry.options.onToggle?.("close")
		await entry.page.remove()
		await entry.page.whenLifecycleReady()
		await visiblePage.wrapper.remove()
		this.visiblePages.pop()
		if !entry.persistOnClose {
			entry.page = null
			entry.options = null
		}
	}

	static async _close({ keepLayout = false } = {}) {
		Assert.false(this.visiblePages.empty, "no page is active")
		const visiblePage = this.visiblePages.last
		Assert.false(visiblePage.isOverlay, "close the active overlay first")
		const entry = this.pages[visiblePage.tag]

		await entry.options.onToggle?.("close")
		await entry.page.remove()
		await entry.page.whenLifecycleReady()

		if entry.layoutElement && !keepLayout {
			await entry.layoutElement.remove()
			await entry.layoutElement.whenLifecycleReady()
		}
		if !entry.persistOnClose {
			entry.page = null
			entry.layoutElement = null
			entry.options = null
		}
		this.visiblePages.pop()
	}

}
