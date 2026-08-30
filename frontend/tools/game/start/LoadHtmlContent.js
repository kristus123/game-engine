export async function LoadHtmlContent(o) {

	Html[o.name] = ({ on = {} } = {}) => {
		const template = document.createElement("template")
		template.innerHTML = o.content

		let div = null

		if (template.content.childElementCount == 0) {
			throw new Error(`"${o.name}" has no top-level elements!`)
		}
		else if (template.content.childElementCount == 1) {
			div = template.content.firstElementChild
		}
		else {
			div = document.createElement("div")
			div.append(...template.content.children)
		}

		div.children.forEach(child => {
			const tag = child.tagName.toLowerCase()
			div[tag] = child // fix hack later
		})

		for (const e of div.querySelectorAll("[id]")) {
			div[e.id] = e // fix hack later
		}

		for (const [methodName, action] of on.all) {
			div.listen("on-call-" + methodName, () => {
				action()
			})
		}

		div.walk(child => {
			for (const attribute of child.attributes) {
				if (attribute.name == "on-click") {
					child.listen("click", () => {
						on[attribute.value]?.()
						child.dispatchEvent(new CustomEvent("on-click", {
							detail: {
								name: attribute.value,
								value: 123,
							}
						}))
					})
				}
				else if (attribute.name == "on-enter") {
					child.onEnter(() => {
						on[attribute.value]?.()
						child.dispatchEvent(new CustomEvent("on-enter", {
							detail: {
								name: attribute.value,
								value: 123,
							}
						}))
					})
				}
			}
		})

		return div
	}

}
