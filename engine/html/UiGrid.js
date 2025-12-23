export class UiGrid {
	static test() {
		Ui.overlay([
			Html.div('default-grid', [
				Html.div('grid-top', [
					Html.button('top'),
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
