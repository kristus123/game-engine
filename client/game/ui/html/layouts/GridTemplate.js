export class GridTemplate {
	constructor(args) {
		this.ui = Dom.overlay([
			this.grid = Html.div("grid", [
				this.top = Html.div("grid-top", []).addClass('scrollable'),
				this.mid = Html.div("grid-mid", []).addClass('scrollable'),
				this.bot = Html.div("grid-bot", []).addClass('visible'),
			])
		])

		this.grid.style.setProperty("--areas", args.areas)

		this.grid.style.setProperty("--rows", args.h)
		this.grid.style.setProperty("--cols", args.v)
	}

	 show() {
		Html.show(this.ui)

		return this
	}

	 hide() {
		Html.hide(this.ui)

		return this
	}

}
