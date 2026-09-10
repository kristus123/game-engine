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
		async connectedCallback() {
			const content = template.content.cloneNode(true)

			const slots = {}
			for (const s of content.querySelectorAll("slot")) {
				slots[s.getAttribute("name")] = s
			}

			this.replaceChildren(content)

			for (const actualSlot of this.querySelectorAll("slot")) {
				if (slots[actualSlot.getAttribute("name")]) {
					actualSlot.replaceWith(slots[actualSlot.getAttribute("name")])
				}
			}

			this.walk(child => { // needs to run before js.default is called
				if (child.hasAttribute("id")) { // since something inside might want to get an id
					this[child.getAttribute("id")] = child
				}
			})

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
				console.log("updating state to : " + newState)
			}

			const { methods = {}, state = null } = await js?.default({ html: this, setState: setState }) ?? {}
			InjectAttributeLogicToHtml(this, methods, setState)

			if (state) {
				setState(state)
			}
		}
	})
}
