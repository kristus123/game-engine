export class LandingPage {
	static {
		this.dom = Dom.overlay(Html.button('This is landing page', () => {
			Page.go(OtherPage)
		}).animate('fade-in', () => {
			console.log('Animation finished')

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