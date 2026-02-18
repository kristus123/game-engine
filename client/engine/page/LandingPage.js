export class LandingPage {
	static {
		this.g = GridTemplate()
		this.g.mid.add(Html.div("white", [
			Html.button("Hei", () => {
				Page.go(OtherPage)
			})
		]))
		Page.init(this, "/landingPage") //Mus be at bottom
	}

	static show() {
		this.g.show()
	}

	static hide() {
		this.g.hide()
	}
}