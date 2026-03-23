export class LandingPage {
	static {

		const x = PhoneLayout()
		this.g = x

		x.top.addClass("red")
		x.top.add(Flex.h([
			Html.p("hei"),
			Html.p("hei"),
		]))

		x.mid.addClass("white")
		x.mid.add(H.button('click', () => {
			Page.go(OtherPage)
		}))

		x.bot.addClass("blue")
		x.bot.add(H.p("hei").addClass('glow'))

		Page.init(this) //Must be at bottom
	}

	static show() {
		this.g.show()
	}

	static hide() {
		this.g.hide()
	}
}
