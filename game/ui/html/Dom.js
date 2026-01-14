export class Dom {

	static swap(e) {
		const newBody = document.createElement('body')

		newBody.append(e)
		document.body.parentNode.replaceChild(newBody, document.body)
	}

	static overlay(elements) {
		const div = Html.div('overlay', Always.list(elements))

		document.body.appendChild(div)

		return div
	}

	static add(elements) { // should this add itself to an overlay? i guess that would make sense. this is for easy debugging and not for proper layouts
		for (const e of Always.list(elements)) {
			document.body.appendChild(Html.div('overlay', e))
		}
	}

	static floating(e, position) {
		position = Camera.p(position) // todo imrpoveo ofc

		e.classList.add('ui')

		e.style.left = `${position.x}px`
		e.style.top = `${position.y - 50}px`


		document.body.appendChild(e)

		setTimeout(() => {
  			e.remove()
		}, 2000)

		return e
	}
}
