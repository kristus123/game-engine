export async function LoadHtmlContent(o) {
	// consider not using getter. i think that is the better approach
	Getter(F, o.name, () => {
		const template = document.createElement("template")
		template.innerHTML = o.content

		let div = null

		if (template.content.childElementCount === 0) {
			throw new Error(`"${o.name}" has no top-level elements!`)
		}
		else if (template.content.childElementCount === 1) {
			div = template.content.firstElementChild
		}
		else {
			div = document.createElement("div")
			container.append(...template.content.children)
		}

		Array.from(div.children).forEach(child => {
			const tag = child.tagName.toLowerCase()
			Assert.notPresent(div[tag]) // not the safest hack but it's ok. Getter adds it to the prototype
			div[tag] = child
		})

		for (const e of div.querySelectorAll("[id]")) {
			console.log(e)
			Assert.notPresent(div[e.id]) // not the safest hack but it's ok. Getter adds it to the prototype
			div[e.id] = e
		}


		return div
	})
}

