export class Dom {

	static swap(elements) {
		const newBody = document.createElement("body")

		for (const e of Always.list(elements)) {
			newBody.append(e)
		}

		document.body.parentNode.replaceChild(newBody, document.body)
	}

	static overlay(e) {
		Assert.notList(e)

		e.addClass("overlay")

		document.body.appendChild(e)

		return e
	}

	static add(elements) { // should this add itself to an overlay? i guess that would make sense. this is for easy debugging and not for proper layouts
		for (const e of Always.list(elements)) {
			document.body.appendChild(e)
		}
	}

	static remove(e) {
		document.body.removeChild(e)
	}
}
