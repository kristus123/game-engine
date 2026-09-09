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

			for (const child of this.children) {
				const slotName =
					child.getAttribute("slot") ||
					child.getAttribute("name") ||
					""

				if (!slots[slotName]) {
					slots[slotName] = []
				}

				slots[slotName].push(child)
			}

			for (const slot of content.querySelectorAll("slot")) {
				const slotName = slot.getAttribute("name") || ""
				const nodes = slots[slotName]

				if (nodes) {
					slot.replaceWith(...nodes.map(node => node.cloneNode(true)))
				}
				else {
					slot.replaceWith(...slot.childNodes)
				}
			}

			this.replaceChildren(content)

			this.walk(child => {
				if (child.hasAttribute("id")) {
					this[child.getAttribute("id")] = child
				}
			})

			const { slots: slotMethods = {}, methods = {} } =
				await js?.default({ html: this }) ?? {}

			this.walk(child => {
				for (const attribute of child.attributes) {
					switch (attribute.name) {
						case "on-click-go-page":
							child.listen("click", () => {
								Page.go(attribute.value)
							})
						case "on-click":
							child.listen("click", () => {
								methods[attribute.value]?.()
							})
						case "on-click-set-state":
							child.listen("click", () => {
								this.walk(c => {
									const showIf = c.getAttribute("show-if-state")

									if (showIf) {
										if (showIf == attribute.value) {
											c.show()
										}
										else {
											c.hide()
										}
									}
								})
							})
						case "on-enter":
							child.onEnter(() => {
								methods[attribute.value]?.()
							})
						default: {
							// ok
						}
					}
				}
			})
		}
	})
}
