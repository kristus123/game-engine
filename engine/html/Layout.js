export class Layout {
	static test() {
		Ui.add(
			Html.div('overlay', [
				Html.div('default-grid', [
					Html.div('grid-left', [
						Html.button('left'),
						Html.p('wow not me'),
					]),
					Html.div('grid-right', [
						Html.button('right'),
					]),
					Html.div('grid-top', [
						Html.button('top'),
					]),
					Html.div('grid-mid', [
						Html.button('mid'),
					]),
					Html.div('grid-bottom', [
						Html.button('bottom'),
					]),
			])])
		)
	}
}
