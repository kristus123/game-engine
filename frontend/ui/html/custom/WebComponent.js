export function WebComponent(name, html) {
	const template = document.createElement("template")

	template.content.append(
		typeof html === "string"
			? html.toHtml()
			: html
	)

	customElements.define(name, class extends HTMLElement {
		connectedCallback() {
			this.replaceChildren(
				template.content.cloneNode(true)
			)
		}

		disconnectedCallback() {
		}
	})
}
