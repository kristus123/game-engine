export class Ui {

	static overlay(elements) {
		elements = Always.list(elements)

		document.getElementById('ui_elements').appendChild(Html.div('overlay', elements))
		return elements
	}

	static grid(object) {
		Ui.overlay([
			Html.div('grid', [
				Html.div('grid-top', [
					...object.top,
				]),
				Html.div('grid-left', [
				]),
				Html.div('grid-right', [
				]),
				Html.div('grid-mid', [
					...object.mid,
				]),
				Html.div('grid-bottom', [
				]),
			])
		])
	}

}
