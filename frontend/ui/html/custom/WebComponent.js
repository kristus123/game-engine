// To use slots, you need to use shadow DOM, but then you don't get access to the global CSS

//
// Not a big fan of the name because it just doesn't really say that we are registering it, so yeah, but that can be fixed later
//

export function WebComponent(name, html) {
	Assert.string(html)

	const template = document.createElement("template")
	template.content.append(html.toHtml())

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

			this.replaceChildren(content)
		}
	})
}
