export class Ui {

	static overlay(elements) {
		const div = Html.div('overlay', Always.list(elements))

		document.getElementById('ui_elements').appendChild(div)

		return div
	}

	static floating(e, position) {
		position = Camera.p(position) // todo imrpoveo ofc

		e.classList.add('ui')

		e.style.left = `${position.x}px`
		e.style.top = `${position.y - 50}px`


		document.getElementById('ui_elements').appendChild(e)

		setTimeout(() => {
  			e.remove()
		}, 2000)

		return e
	}
}
