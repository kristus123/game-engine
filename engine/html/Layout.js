export class Layout {
	static test() {
		return Html.addToScreen(
			Html.div('overlay', [
				Html.div('default-grid', [
					Html.div('grid-left', [
						Html.button('left'),
					]),
					Html.div('grid-top', [
						Html.button('top'),
					]),
					Html.div('grid-mid', [
						Html.button('mid'),
					]),
			])])
		)
	}
}
