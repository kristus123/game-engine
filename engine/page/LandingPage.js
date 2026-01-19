export class LandingPage {
	static {
		GridUi.show()

		GridUi.mid.clear()

		// GridUi.mid.enableScrolling()

		GridUi.mid.add(Html.div('eui', [
			Html.button('hei', () => {
				console.log('hei')
			}),
			Flex.row([
				Html.p('play'),
				Html.button('play'),
			]),
			Html.div('white', Html.p('hei')),
			Html.div('white', Html.p('hei')),
			Html.div('white', Html.p('hei')),
			Html.div('white', Html.p('hei')),
			Html.div('white', Html.p('hei')),
			Html.div('white', Html.p('hei')),
			Html.div('white', Html.p('hei')),
			Html.div('white', Html.p('hei')),
			Html.div('white', Html.p('hei')),
		]))
	}

	static show() {
		this.dom.show()
	}

	static hide() {
		this.dom.hide()
	}
}
