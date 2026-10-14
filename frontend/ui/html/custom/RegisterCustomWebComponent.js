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
		_lifecyclePromise = Promise.resolve()

		whenReady() {
			return this._setupPromise
		}

		connectedCallback() { // on dom enter
			this._setupPromise ??= this._initialize()
			this._lifecyclePromise = this._lifecyclePromise.then(async () => {
				await this._setupPromise
				if this.isConnected {
					await this._onDomAdd?.()
				}
			})
			return this._lifecyclePromise
		}

		disconnectedCallback() {
			this._lifecyclePromise = this._lifecyclePromise.then(async () => {
				await this._setupPromise
				await this._onDomRemove?.()
			})
			return this._lifecyclePromise
		}

		async _initialize() {
			const content = template.content.cloneNode(true)

			const setState = CustomElementHelper.createSetState(this)

			const slots = {}
			for const s of content.querySelectorAll("slot") {
				slots[s.getAttribute("name")] = s
			}

			this.replaceChildren(content)
			CustomElementHelper.exposeFields(this) // component code may use template ids during initialization

			const options = await js?.default({ html: this, setState }) ?? {}
			this._onDomAdd = options.onDomAdd
			this._onDomRemove = options.onDomRemove
			const { methods = {}, state = null } = options

			this.walk(child => {
				InjectAttributeLogicToHtml(child, methods, setState)
			})

			for const actualSlot of this.querySelectorAll("slot") {
				const slot = slots[actualSlot.getAttribute("name")]
				if !slot {
					continue
				}
				actualSlot.replaceWith(slot)
				slot.walk(c => {
					InjectAttributeLogicToHtml(c, methods, setState)
				})

				for const { name, value } of this.attributes {
					if name.replace("slot-", "") == slot.name {
						slot.replaceWith(document.createTextNode(value))
					}
				}
			}

			CustomElementHelper.exposeFields(this)

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

	return js ?? {}
}
