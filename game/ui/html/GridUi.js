export class GridUi {
	static {
		this.ui = Dom.overlay([
			this.grid = Html.div('grid', [
				this.top = Html.div('grid-top', [Html.p('test')]),
				this.mid = Html.div('grid-mid', [Html.p('test')]),
				this.bottom = Html.div('grid-bottom', [Html.p('test')])
			])
		])
		this.x()
	}

	static show() {
		Html.show(this.ui)
	}

	static hide() {
		Html.hide(this.ui)
	}

	static x() {
		this.grid.style.setProperty('--areas', `
			"top top top"
			"mid mid mid"
			"bottom bottom bottom"
		`)

		this.grid.style.setProperty('--rows', '100px clamp(50px 300px 9000px) 100px')
		this.grid.style.setProperty('--cols', '1fr 1fr 1fr')
	}
}
