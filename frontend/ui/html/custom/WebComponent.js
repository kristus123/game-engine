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
				const name = slot.getAttribute("name")

				for (const child of children) {
					if (child.nodeType != Node.ELEMENT_NODE) {
						continue
					}

					if (child.tagName != "SLOT") {
						continue
					}

					if (child.getAttribute("name") != name) {
						continue
					}

					slot.replaceWith(...child.childNodes)
				}
			}

			this.replaceChildren(content)
		}
	})
}
