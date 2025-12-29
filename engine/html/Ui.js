export class Ui {
	static {}
	
	static overlay(elements) {
		elements = Always.list(elements)

		document.getElementById('ui_elements').appendChild(Html.div('overlay', elements))
		return elements
	}
}
