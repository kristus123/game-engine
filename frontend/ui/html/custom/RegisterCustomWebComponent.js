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
			console.log("___")
			console.log(name)

			for (const actualSlot of this.querySelectorAll("slot")) {
				for (const slot of content.querySelectorAll("slot")) {
					actualSlot.replaceWith()
				}
			}

			this.replaceChildren(content)

			console.log(this)
			console.log("___")
			console.log("")
			console.log("")
			console.log("")

			this.walk(child => { // needs to run before js.default is called
				if (child.hasAttribute("id")) {
					this[child.getAttribute("id")] = child
				}
			})

			const { methods = {} } = await js?.default({ html: this }) ?? {}
			InjectAttributeLogicToHtml(this, methods)
		}
	})
}
