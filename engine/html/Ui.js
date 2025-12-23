export class Ui {

	static overlay(elements) {
		elements = Always.list(elements)

		document.getElementById('ui_elements').appendChild(Html.div('overlay', elements))
		return elements
	}

	static grid(e) {
		Ui.overlay([
			Html.div('grid', [
				Html.div('grid-top', [
					...Always.list(e),
				]),
				Html.div('grid-left', [
					Html.button('left'),
					Html.p('wow not me'),
				]),
				Html.div('grid-right', [
					Html.button('right'),
				]),
				Html.div('grid-mid', [
					Html.button('mid'),
				]),
				Html.div('grid-bottom', [
					Html.button('bottom'),
				]),
			])
		])
	}

}
