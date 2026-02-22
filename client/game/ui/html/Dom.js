export class Dom {

	static swap(elements) {
		const newBody = document.createElement("body")

		for (const e of Always.list(elements)) {
			newBody.append(e)
		}

		document.body.parentNode.replaceChild(newBody, document.body)
	}

	static overlay(elements) {
		const div = Html.div("overlay", Always.list(elements))

		document.body.appendChild(div)

		return div
	}

	static add(elements) { // should this add itself to an overlay? i guess that would make sense. this is for easy debugging and not for proper layouts
		for (const e of Always.list(elements)) {
			document.body.appendChild(e)
		}
	}
}
