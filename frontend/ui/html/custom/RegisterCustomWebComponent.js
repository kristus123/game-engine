function _toHtml(string) {
	const r = new DOMParser()
		.parseFromString(string, "text/html")
		.body
		.children

	return [...r]
}

export async function RegisterCustomWebComponent(name, html, js = null) { // no-null-check
	Assert.string(name)
	Assert.string(html)

	const template = document.createElement("template")

	for (const c of _toHtml(html)) {
		template.content.append(c)
	}

	if (js) {
		js = await import(js)
		Assert.value(js.default)
	}

	customElements.define(name, class extends HTMLElement {
		constructor() {
			this._connected = false
			this._setupPromise = null
			this._destroyPromise = null
			this._onConnected = null
			this._onDisconnected = null
			this._onDestroy = null
			this._neverDestroy = this.neverDestroy == true
			this._lifecycleActive = false
			this._setState = null
		}

		async connectedCallback() {
			if (this._connected || this._destroyPromise != null) {
				return
			}

			this._connected = true
			this._dispatchLifecycleEvent("connected")
			if (this._destroyPromise != null || !this._connected) {
				return
			}

			if (!this._setupPromise) {
				this._setupPromise = this._initialize()
			}

			await this._setupPromise
			if (!this._connected || this._destroyPromise != null || this._lifecycleActive) {
				return
			}

			this._lifecycleActive = true
			await this._callHook(this._onConnected)
		}

		disconnectedCallback() {
			if (!this._connected) {
				return
			}

			this._connected = false
			this._dispatchLifecycleEvent("disconnected")

			const wasActive = this._lifecycleActive
			this._lifecycleActive = false
			const onDisconnected = wasActive
				? this._callHook(this._onDisconnected)
				: Promise.resolve()

			onDisconnected
				.catch(console.error)
				.then(() => this._destroyIfNeeded())
				.catch(console.error)
		}

		destroy() {
			if (this._destroyPromise != null) {
				return this._destroyPromise
			}

			this._destroyPromise = Promise.resolve().then(() => this._finishDestroy())
			return this._destroyPromise
		}

		async _finishDestroy() {
			this.remove()
			try {
				await this._setupPromise
				await this._onDestroy?.({ html: this, setState: this._setState })
			}
			finally {
				this.walk(child => {
					const id = child.getAttribute("id")
					if (id && this[id] == child) {
						delete this[id]
					}
				})
				this.replaceChildren()
				this._dispatchLifecycleEvent("destroyed")
			}
		}

		async _initialize() {
			const content = template.content.cloneNode(true)

			const slots = {}
			for (const s of content.querySelectorAll("slot")) {
				slots[s.getAttribute("name")] = s
			}

			this.replaceChildren(content)

			const exposeIds = () => {
				this.walk(child => {
					if (!child.hasAttribute("id")) {
						return
					}

					const id = child.getAttribute("id")
					this[id] = child
				})
			}
			exposeIds() // component code may use template ids during initialization

			const setState = newState => {
				Assert.value(newState)

				this.walk(c => {
					const showIf = c.getAttribute("show-if-state")

					if (showIf) {
						if (showIf == newState) {
							c.show()
						}
						else {
							c.hide()
						}
					}
				})

				return newState
			}
			this._setState = setState

			const { methods = {}, state = null, onConnected = null, onDisconnected = null, onDestroy = null, neverDestroy = false } = await js?.default({ html: this, setState: setState }) ?? {}
			this._onConnected = onConnected
			this._onDisconnected = onDisconnected
			this._onDestroy = onDestroy
			this._neverDestroy = this._neverDestroy || this.neverDestroy == true || neverDestroy

			this.walk(child => {
				InjectAttributeLogicToHtml(child, methods, setState)
			})

			for (const actualSlot of this.querySelectorAll("slot")) {
				if (slots[actualSlot.getAttribute("name")]) {
					const s = slots[actualSlot.getAttribute("name")]
					actualSlot.replaceWith(s)
					s.walk(c => {
						InjectAttributeLogicToHtml(c, methods, setState)
					})

					for (const { name, value } of this.attributes) {
						if (name.replace("slot-", "") == s.name) {
							s.replaceWith(document.createTextNode(value))
						}
					}
				}
			}

			exposeIds()

			if (A.string(state)) {
				setState(state)
			}
			else if (A.method(state)) {
				setState(Assert.string(await state()))
			}
			else if (state == null) {
				// no initial state is fine
			}
			else {
				throw new Error("unsupported state value")
			}
		}

		async _callHook(hook) { // no-null-check
			return await hook?.({ html: this, setState: this._setState })
		}

		async _destroyIfNeeded() {
			await this._setupPromise
			if (!this._connected && !this._neverDestroy) {
				await this.destroy()
			}
		}

		_dispatchLifecycleEvent(name) {
			this.dispatchEvent(new CustomEvent(`component-${name}`, {
				bubbles: true,
				composed: true,
				detail: { element: this },
			}))
		}
	})
}
