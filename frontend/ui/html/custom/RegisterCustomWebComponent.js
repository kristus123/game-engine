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
		}

		async connectedCallback() {
			if (this._connected) {
				return true
			}

			this._connected = true

			const content = template.content.cloneNode(true)

			const slots = {}
			for (const s of content.querySelectorAll("slot")) {
				slots[s.getAttribute("name")] = s
			}

			this.replaceChildren(content)

			this.walk(child => { // needs to run before js.default is called
				if (child.hasAttribute("id")) { // since something inside might want to get an id
					this[child.getAttribute("id")] = child
				}
			})

			const setState = newState => {
				console.log("pupdating state to " + newState)
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
				console.log("updating state to : " + newState)

				return newState
			}

			const { methods = {}, state = null } = await js?.default({ html: this, setState: setState }) ?? {}

			this.walk(child => {
				InjectAttributeLogicToHtml(child, methods, setState)
			})

			for (const actualSlot of this.querySelectorAll("slot")) {
				if (slots[actualSlot.getAttribute("name")]) {
					const s = slots[actualSlot.getAttribute("name")]
					console.log(s.children)
					actualSlot.replaceWith(s)
					s.walk(c => {
						InjectAttributeLogicToHtml(c, methods, setState)
					})
				}
			}

			this.walk(child => { // needs to run before js.default is called
				if (child.hasAttribute("id")) { // since something inside might want to get an id
					this[child.getAttribute("id")] = child
				}
			})

			if (state) {
				if (A.string(state)) {
					setState(state)
				}
				else if (A.method(state)) {
					setState(await state())
				}
				else {
					throw new Error("unuspported state value")
				}
			}

		}
	})
}
