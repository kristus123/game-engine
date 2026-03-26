export class PracticePage {
	static {
		const db = Db("jap")
		this.db = db

		const p = PhoneLayout()
		this.g = p

		const top = p.top
		const mid = p.mid
		const bot = p.bot

		top.addClass("red")

		top.add(Flex.h([
			H.button('landingpage', () => {
				Page.go(LandingPage)
			}).css('font-size:10px;'),
		]))

		mid.addClass("white")
		mid.addClass("center")

		bot.addClass('center')
		bot.addClass("blue")

		bot.add(Flex.h([
			H.button('hard'),
			H.button('easy'),
		]).css('transform: translate(0px, -30px)'))

		Page.init(this) //Must be at bottom
	}

	static show() {
		this.g.show()
	}

	static hide() {
		this.g.hide()
	}
}
