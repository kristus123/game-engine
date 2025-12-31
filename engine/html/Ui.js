export class Ui {

	static overlay(elements) {
		const div = Html.div('overlay', Always.list(elements))

		document.getElementById('ui_elements').appendChild(div)

		return div
	}
}
