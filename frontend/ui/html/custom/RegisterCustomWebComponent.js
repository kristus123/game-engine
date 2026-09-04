function _toHtml(string) {
	const r = new DOMParser()
		.parseFromString(string, "text/html")
		.body.children

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

			for (const slot of content.querySelectorAll("slot")) {
				const slotName = slot.getAttribute("name")

				for (const child of this.childNodes) {
					slot.replaceWith(...child.childNodes)
				}

				this.attributes.forEach((i, slotAttribute) => {
					if (slotAttribute.name == "slot-" + slotName) {
						slot.replaceWith(document.createTextNode(slotAttribute.value))
					}
				})
			}

			this.replaceChildren(content)

			 this.walk(child => {
				 if (child.hasAttribute("id")) {
					 this[child.getAttribute("id")] = child
				 }
			 })

			const {slots = {}, methods = {}} = await js?.default({html: this }) ?? {}

			 this.walk(child => {
				for (const attribute of child.attributes) {
					switch attribute.name {
						case "on-click" {
							child.listen("click", () => {
								methods[attribute.value]?.()
							})
						}
						case "on-enter" {
							child.onEnter(() => {
								methods[attribute.value]?.()
							})
						}
						default: {
							// can be ignored
						}
					}
				}
			})

		}
	})
}
