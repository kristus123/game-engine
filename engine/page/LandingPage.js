export class LandingPage {
	static {
		this.dom = Dom.overlay(Html.button('This is landing page', () => {
			Page.go(OtherPage)
		}))
		Page.init(this, '/landingPage')

	}

	static show() {
		this.dom.show()
	}

	static hide() {
		this.dom.hide()
	}
}