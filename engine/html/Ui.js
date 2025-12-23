export class Ui {

	static add(element) {
		document.getElementById('ui_elements').appendChild(element)
		return element
	}

	static overlay(elements) {
		elements = Always.list(elements)

		document.getElementById('ui_elements').appendChild(Html.div('overlay', elements))
		return elements
	}

}
