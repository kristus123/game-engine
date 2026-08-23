export async function LoadHtmlContent(o) {

	Enhance(Html, o.name, () => {
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

		return div
	})
}
