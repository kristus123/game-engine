export class GridTemplate {
	constructor() {
		this.ui = Dom.overlay([
			this.grid = Html.div('grid', [
				this.top = Html.div('grid-top', [Html.p('test')]),
				this.mid = Html.div('grid-mid', [Html.p('test')]),
				this.bottom = Html.div('grid-bottom', [Html.p('test')])
			])
		])
		this.grid.style.setProperty('--areas', `
			"top top top"
			"left mid right"
			"bottom bottom bottom"
		`)

		this.grid.style.setProperty('--rows', 'auto 1fr auto')
		this.grid.style.setProperty('--cols', '1fr 1fr 1fr')
	}

	 show() {
		Html.show(this.ui)
	}

	 hide() {
		Html.hide(this.ui)
	}

	 x() {

	}
}
