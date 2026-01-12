export class Ui {

	static swap(e) {
		const newBody = document.createElement('body')

		newBody.append(e)
		document.body.parentNode.replaceChild(newBody, document.body)

	}

	static overlay(elements) {
		const div = Html.div('overlay', Always.list(elements))

		document.getElementById('ui_elements').appendChild(div)

		return div
	}
}
