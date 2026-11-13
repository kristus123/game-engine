export class Page {

	static pages = {}

	static visiblePages = []

	static navigation = Promise.resolve()
	static historyEnabled = false
	static pendingHistoryBack = null
	static defaultTag = null

	static start(defaultTag) {
		if this.historyEnabled {
			return this.navigation
		}
		this.defaultTag = defaultTag
		const stack = this._stackFromUrl()
		this._validateStack(stack)
		this.historyEnabled = true
		window.addEventListener("popstate", () => {
			let target
			try {
				target = this._stackFromUrl()
				this._validateStack(target)
			}
			catch (error) {
				console.error("Invalid page URL", error)
				target = this._snapshot()
				this._writeHistory("replace")
			}
			if this.pendingHistoryBack != null {
				const resolve = this.pendingHistoryBack
				this.pendingHistoryBack = null
				resolve(target)
				return
			}
			this._enqueue(() => this._restore(target)).catch(error => {
				console.error("Could not restore page navigation", error)
				this._writeHistory("replace")
			})
		})
		return this._enqueue(async () => {
			if window.history.state?.pageNavigation {
				await this._restore(stack)
				this._writeHistory("replace")
			}
			else {
				await this._open(stack[0].tag)
				this._writeHistory("replace")
				for const page of stack.slice(1) {
					await this._openOverlay(page.tag)
					this._writeHistory("push")
				}
			}
		})
	}

	static _enqueue(action) {
		const navigation = this.navigation.then(() => this._transition(action))
		this.navigation = navigation.catch(() => {})
		return navigation
	}

	static _snapshot() {
		return this.visiblePages.map(({ tag, isOverlay }) => ({ tag, isOverlay }))
	}

	static _stackFromUrl() {
		const url = new URL(window.location.href)
		const path = url.pathname == "/index.html" ? "" : decodeURIComponent(url.pathname).replace(/^\/+|\/+$/g, "")
		const tag = path ? this._resolveTag(path) : url.searchParams.has("viewer") ? "viewer-page" : url.searchParams.has("streamer") ? "streamer-page" : this.defaultTag
		return [
			{ tag, isOverlay: false },
			...url.searchParams.getAll("modal").map(name => ({ tag: this._resolveTag(name), isOverlay: true })),
		]
	}

	static _resolveTag(name) {
		return Object.hasOwn(this.pages, name) ? name : `${name}-page`
	}

	static _validateStack(stack) {
		const tags = new Set()
		for const page of stack {
			Assert.true(Object.hasOwn(this.pages, page.tag), `Unknown page: ${page.tag}`)
			Assert.false(tags.has(page.tag), "page is already visible")
			Assert.false(page.isOverlay && this.pages[page.tag].layout != null, "pages with a shared layout cannot open as custom overlays")
			tags.add(page.tag)
		}
	}

	static _writeHistory(mode) {
		if !this.historyEnabled {
			return
		}
		const stack = this._snapshot()
		const oldState = window.history.state?.pageNavigation
		if mode == "push" && JSON.stringify(stack) == JSON.stringify(oldState?.stack) {
			return
		}
		const url = new URL(window.location.href)
		url.pathname = stack.length ? `/${stack[0].tag.replace(/-page$/, "")}` : "/"
		url.searchParams.delete("viewer")
		url.searchParams.delete("streamer")
		url.searchParams.delete("modal")
		for const page of stack.slice(1) {
			url.searchParams.append("modal", page.tag.replace(/-page$/, ""))
		}
		const previous = mode == "push" ? oldState?.stack : oldState?.previous
		window.history[mode == "push" ? "pushState" : "replaceState"]({
			...window.history.state,
			pageNavigation: { stack, previous },
		}, "", url)
	}

	static async _restore(stack) {
		this._validateStack(stack)
		let common = 0
		while (common < stack.length && this.visiblePages[common]?.tag == stack[common].tag && this.visiblePages[common]?.isOverlay == stack[common].isOverlay) {
			common++
		}
		if common == 0 {
			await this._open(stack[0].tag)
			common = 1
		}
		while (this.visiblePages.length > common) {
			await this._closeOverlay()
		}
		for const page of stack.slice(common) {
			await this._openOverlay(page.tag)
		}
	}

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
		return this._enqueue(async () => {
			await this._open(tag)
			this._writeHistory("push")
		})
	}

	static async _open(tag) {
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
	}

	static openAsModalFixed(tag) {
		return this._enqueue(async () => {
			await this._openOverlay(tag)
			this._writeHistory("push")
		})
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
			catch {
				// Preserve the original setup error while removing a failed modal.
			}
			try {
				await entry.page.whenLifecycleReady()
			}
			catch {
				// Preserve the original setup error while removing a failed modal.
			}
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

	static close({ keepLayout = false } = {}) {
		return this._enqueue(async () => {
			Assert.false(this.visiblePages.empty, "no page is active")
			const visiblePage = this.visiblePages.last
			if visiblePage.isOverlay {
				const previous = this.historyEnabled ? window.history.state?.pageNavigation?.previous : null
				if previous && JSON.stringify(previous) == JSON.stringify(this._snapshot().slice(0, -1)) {
					const stack = await new Promise(resolve => {
						this.pendingHistoryBack = resolve
						window.history.back()
					})
					await this._restore(stack)
					return
				}
				await this._closeOverlay()
			}
			else {
				await this._close({ keepLayout })
			}
			this._writeHistory("replace")
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
