export async function RegisterCustomWebComponent(name, html, js = null) { // no-null-check
	Assert.string(name)
	Assert.string(html)

	const template = document.createElement("template")
	template.content.append(...new DOMParser().parseFromString(html, "text/html").body.children)

	if js {
		js = await import(js)
		Assert.value(js.default)
	}

	customElements.define(name, class extends HTMLElement {
		_setupPromise = null
		_destroyed = false
		_lifecycleActive = false

		async connectedCallback() { // on dom enter
			if !this.isConnected || this._destroyed {
				return
			}

			await (this._setupPromise ??= this._initialize())
			if !this.isConnected || this._destroyed {
				return
			}

			this._lifecycleActive = true
		}

		async disconnectedCallback() { // on dom leave
			if this._destroyed {
				return
			}

			const wasActive = this._lifecycleActive
			this._lifecycleActive = false
			const options = await this._setupPromise ?? {}
			if wasActive {
				await options.onDisconnected?.()
			}
			if this.isConnected || this.neverDestroy || this._destroyed {
				return
			}

			this._destroyed = true
			await options.onDestroy?.()
			CustomElementHelper.removeFields(this)
			this.replaceChildren()
		}

		async _initialize() {
			const element = this
			const content = template.content.cloneNode(true)

			const setState = CustomElementHelper.createSetState(element)

			const slots = {}
			for const s of content.querySelectorAll("slot") {
				slots[s.getAttribute("name")] = s
			}

			element.replaceChildren(content)
			CustomElementHelper.exposeFields(element) // component code may use template ids during initialization

			const options = await js?.default({ html: element, setState }) ?? {}
			const { methods = {}, state = null, neverDestroy = element.neverDestroy ?? false } = options
			element.neverDestroy = neverDestroy

			element.walk(child => {
				InjectAttributeLogicToHtml(child, methods, setState)
			})

			for const actualSlot of element.querySelectorAll("slot") {
				const slot = slots[actualSlot.getAttribute("name")]
				if !slot {
					continue
				}
				actualSlot.replaceWith(slot)
				slot.walk(c => {
					InjectAttributeLogicToHtml(c, methods, setState)
				})

				for const { name, value } of element.attributes {
					if name.replace("slot-", "") == slot.name {
						slot.replaceWith(document.createTextNode(value))
					}
				}
			}

			CustomElementHelper.exposeFields(element)

			if A.string(state) {
				setState(state)
			}
			else if A.method(state) {
				setState(Assert.string(await state()))
			}
			else if A.value(state) {
				throw new Error("unsupported state value")
			}

			return options
		}
	})
}
