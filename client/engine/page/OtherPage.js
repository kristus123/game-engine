export class OtherPage {
	static {
		this.dom = Dom.overlay(Html.button('This is Other Page'))
		Page.init(this, '/landingPage')

	}

	static show() {
		this.dom.show()
	}

	static hide() {
		this.dom.hide()
	}
}