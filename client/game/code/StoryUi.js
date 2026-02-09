export class StoryUi {
	static {
		this.ui = Dom.overlay([
			Html.div('story-grid', [
				this.top = Html.div('story-grid-top'),
				this.mid = Html.div('story-grid-mid'),
				this.bottom = Html.div('story-grid-bottom')
			])
		])
	}

	static show() {
		Html.show(this.ui)
	}

	static hide() {
		Html.hide(this.ui)
	}
}
