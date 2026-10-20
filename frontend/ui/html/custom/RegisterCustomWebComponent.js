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
		_lifecyclePromise = PromiseQueue()

		_onDomAdd = null
		_onDomRemove = null

		whenReady() {
			return this._setupPromise
		}

		async connectedCallback() { // triggered when added to dom
			if name.endsWith("-page") {
				this.classList.add("page-host")
			}

			this._setupPromise ??= (async () => {
				const assignedNodesBySlot = {}
				for const child of [...this.childNodes] {
					let slotName = ""
					if child.nodeType == Node.ELEMENT_NODE {
						if child.tagName == "SLOT" {
							slotName = child.getAttribute("name") ?? ""
						}
						else {
							slotName = child.getAttribute("slot") ?? ""
						}
					}
					assignedNodesBySlot[slotName] ??= []
					assignedNodesBySlot[slotName].push(child)
				}

				const content = template.content.cloneNode(true)
				const setState = CustomElementHelper.createSetState(this)

				this.replaceChildren(content)
				CustomElementHelper.exposeFields(this)

				const options = await js?.default({ html: this, setState }) ?? {}
				this._onDomAdd = options.onDomAdd
				this._onDomRemove = options.onDomRemove

				this.walk(child => {
					InjectAttributeLogicToHtml(child, options.methods, setState)
				})

				for const actualSlot of this.querySelectorAll("slot") {
					const slotName = actualSlot.getAttribute("name") ?? ""
					const assignedNodes = assignedNodesBySlot[slotName]
					if assignedNodes?.length > 0 {
						actualSlot.replaceWith(...assignedNodes)
						for const node of assignedNodes {
							if node.nodeType == Node.ELEMENT_NODE {
								node.walk(c => {
									InjectAttributeLogicToHtml(c, options.methods, setState)
								})
							}
						}
						delete assignedNodesBySlot[slotName]
						continue
					}

					for const { name, value } of this.attributes {
						if name == "slot-" + slotName {
							actualSlot.replaceWith(document.createTextNode(value))
							break
						}
					}
				}

				CustomElementHelper.exposeFields(this)

				if A.string(options.state) {
					setState(options.state)
				}
				else if A.method(options.state) {
					setState(Assert.string(await options.state()))
				}
				else if A.value(options.state) {
					throw new Error("unsupported state value")
				}

				return options
			})()

			await this._setupPromise

			await this._lifecyclePromise.add(async () => {
				if this.isConnected {
					await this._onDomAdd?.()
				}
			})
		}

		async disconnectedCallback() { // triggered when removed from dom
			await this._lifecyclePromise.add(async () => {
				await this._setupPromise
				await this._onDomRemove?.()
			})
		}
	})

	if name.endsWith("-layout") {
		Layout.register(name)
	}

	return js ?? {}
}
