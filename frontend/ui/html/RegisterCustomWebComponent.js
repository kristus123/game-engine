function mapFields(element, fields) {
	for const [name, value] of Object.entries(fields) {
		if name != "fields" && !(name in element) {
			element[name] = value
		}
	}
}

function initializeFields(element, fields) { // no-null-check
	if !fields {
		return
	}

	const values = A.method(fields) ? fields() : fields
	Assert.false(A.promise(values), "Component fields must be created synchronously")
	Assert.object(values)
	element.fields = values
	mapFields(element, values)
}

function bindMethods(element, methods) { // no-null-check
	if !methods {
		return methods
	}

	return Object.fromEntries(Object.entries(methods).map(([name, method]) => [
		name,
		(...args) => method(element, ...args),
	]))
}

function bindCallbackMaps(element, callbacks) { // no-null-check
	if !callbacks {
		return callbacks
	}

	return Object.fromEntries(Object.entries(callbacks).map(([name, callback]) => [
		name,
		(...args) => callback(element, ...args),
	]))
}

function createInstanceOptions(element, definition, setState) {
	return {
		...definition,
		methods: bindMethods(element, definition.methods),
		state: A.method(definition.state) ? (...args) => definition.state(element, setState, ...args) : definition.state,
		onPageOpen: definition.onPageOpen ? (...args) => definition.onPageOpen(element, ...args) : null,
		onPageClose: definition.onPageClose ? (...args) => definition.onPageClose(element, ...args) : null,
		onToggle: definition.onToggle ? (...args) => definition.onToggle(element, ...args) : null,
		onHoverShow: bindCallbackMaps(element, definition.onHoverShow),
		onHoverHide: bindCallbackMaps(element, definition.onHoverHide),
		onClick: bindCallbackMaps(element, definition.onClick),
		onClose: bindCallbackMaps(element, definition.onClose),
	}
}

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
		_onFirstDomAdd = null
		_onDomRemove = null
		_didFirstDomAdd = false

		constructor() {
			super()
			const fields = A.method(js?.default) ? js.default.createFields : js?.default?.fields
			initializeFields(this, fields)
		}

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

				const childSetupPromises = [...this.querySelectorAll("*")]
					.filter(child => A.method(child.whenReady))
					.map(child => child.whenReady())
				await Promise.all(childSetupPromises)
				CustomElementHelper.exposeFields(this)

				const options = A.method(js?.default)
					? await js.default({ html: this, setState }) ?? {}
					: js?.default ? createInstanceOptions(this, js.default, setState) : {}
				if A.method(js?.default) {
					initializeFields(this, options.fields)
				}
				this._onFirstDomAdd = options.onFirstDomAdd
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
					if !this._didFirstDomAdd {
						this._didFirstDomAdd = true
						await this._onFirstDomAdd?.(this)
					}
					if !this.isConnected {
						return
					}
					await this._onDomAdd?.(this)
				}
			})
		}

		async disconnectedCallback() { // triggered when removed from dom
			await this._lifecyclePromise.add(async () => {
				await this._setupPromise
				await this._onDomRemove?.(this)
			})
		}
	})

	return js ?? {}
}
