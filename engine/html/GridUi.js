export class GridUi {
	static {
		this.ui = Ui.overlay([
			Html.div('grid', [
				this.top = Html.div('grid-top'),
				this.left = Html.div('grid-left'),
				this.right = Html.div('grid-right'),
				this.mid = Html.div('grid-mid'),
				this.bottom = Html.div('grid-bottom')
			])
		])

		this.hide()
	}

	static show() {
		Html.show(this.ui)
	}

	static hide() {
		Html.hide(this.ui)
	}
}
