export class Dom {

	static overlay(e) {
		Assert.notList(e)

		e.addClass("overlay")

		document.body.appendChild(e)

		return e
	}

	static add(e) { // should this add itself to an overlay? i guess that would make sense. this is for easy debugging and not for proper layouts
		Assert.notList(e)
		document.body.appendChild(e)
		return e
	}

	static remove(e) {
		Assert.notList(e)

		document.body.removeChild(e)
	}

	static swapBody(elements) {
		const newBody = document.createElement("body")

		for (const e of Always.list(elements)) {
			newBody.append(e)
		}

		document.body.parentNode.replaceChild(newBody, document.body)
	}
}
