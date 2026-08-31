export async function RegisterCustomWebComponent(name, html, js = null) { // no-null-check
	Assert.string(name)
	Assert.string(html)

	const template = document.createElement("template")
	template.content.append(html.toHtml())
	if (js) {
		js = await import(js)
		Assert.value(js.default)
	}

	customElements.define(name, class extends HTMLElement {
		connectedCallback() {
			const children = [...this.childNodes]
			const content = template.content.cloneNode(true)

			for (const slot of content.querySelectorAll("slot")) {
				const slotName = slot.getAttribute("name")

				for (const child of children) {
					if (child.nodeType != Node.ELEMENT_NODE) {
						continue
					}
					else if (child.tagName != "SLOT") {
						continue
					}
					else if (child.getAttribute("name") != slotName) {
						continue
					}
					else if (this.getAttribute("slot-" + slotName)) {
						throw new Error("duplicate. only choose one way of setting slot value")
					}

					slot.replaceWith(...child.childNodes)
				}

				this.attributes.forEach((i, slotAttribute) => {
					if (slotAttribute.name.startsWith("slot-")) {
						if (slotAttribute.name.replace("slot-", "") == slotName) {
							slot.replaceWith(document.createTextNode(slotAttribute.value))
						}
					}
				})
			}

			js.default(this)

			this.replaceChildren(content)
		}
	})
}
