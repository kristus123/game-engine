export class PhoneUi {
	static {
		this.ui = Ui.overlay([
			Html.div('phone', [
				this.top = Html.div('phone-top'),
				this.mid = Html.div('phone-mid'),
				this.bottom = Html.div('phone-bottom')
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
