export class GridUi {
	static {
		Ui.overlay([
			Html.div('grid', [
				this.top    = Html.div('grid-top'),
				this.left   = Html.div('grid-left'),
				this.right  = Html.div('grid-right'),
				this.mid    = Html.div('grid-mid'),
				this.bottom = Html.div('grid-bottom')
			])
		])
	}
}
