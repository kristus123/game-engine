export class Dom {

	static overlay(e) {
		Assert.notList(e) // do Assert.htmlElement instead in the future

		e.addClass("overlay")

		document.body.appendChild(e)

		return e
	}

	static add(e) { // should this add itself to an overlay? i guess that would make sense. this is for easy debugging and not for proper layouts
		Assert.notList(e) // do Assert.htmlElement instead in the future

		if (document.body.contains(e)) {
			throw new Error("use .move if element is already in dom")
		}
		else {
			document.body.appendChild(e)
			return e
		}
	}

	static move(e) {
		Assert.notList(e) // do Assert.htmlElement instead in the future

		if (document.body.contains(e)) {
			document.body.appendChild(e)
			return this
		}
		else {
			throw new Error("element must be added in dom before it can be moved")
		}

	}

	static remove(e) {
		Assert.notList(e) // do Assert.htmlElement instead in the future

		if (document.body.contains(e)) {
			document.body.removeChild(e)
		}
		else {
			throw new Error("element is not in Dom")
		}
	}

	static swapBody(elements) {
		const newBody = document.createElement("body")

		for (const e of Always.list(elements)) {
			newBody.append(e)
		}

		document.body.parentNode.replaceChild(newBody, document.body)
	}
}
