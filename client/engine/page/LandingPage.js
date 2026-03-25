export class LandingPage {
	static {
		const db = Db("jap")
		this.db = db

		const p = PhoneLayout()
		const top = p.top
		const mid = p.mid
		const bot = p.bot
		this.mid = p.mid

		top.addClass("red")

		top.add(Flex.h([
			H.button('hei').css('font-size:10px;'),
			H.button('hei').css('font-size:10px;'),
			H.button('hei').css('font-size:10px;'),
		]))

		mid.addClass("white")
		mid.addClass("center")

		const button = H.button("start", () => {
			if (Microphone.recording) {
				button.text("start")

				Microphone.stop(blob => {
					db.save({
						text: "hello",
						audio: blob,
					}, c => {
						this.addCard(c)
					})
				})
			}
			else {
				button.text("stop")
				Microphone.start()
			}
		})

		bot.add(button)
		button.css('position: relative;')
		button.css('transform: translateY(-30px);')
		bot.addClass('center')

		db.forEach(c => {
			this.addCard(c)
		})

		p.bot.addClass("blue")

		this.g = p
		Page.init(this) //Must be at bottom
	}

	static addCard(c) {
		const div = H.div().addClass("blue").css('min-height:100px;')


		div.css("margin:20px;")
		const p = H.p(c.text)

		div.add(p)

		div.add(H.button("play", () => {
			Sound.playBlob(c.audio)
		}))

		div.add(H.button("delete", () => {
			this.db.delete(c)
			div.remove()
		}))

		div.add(H.button("edit", () => {
			c.text = 'updated'
			this.db.update(c)
			p.text('updated')
		}))

		this.mid.add(div)
	}

	static show() {
		this.g.show()
	}

	static hide() {
		this.g.hide()
	}
}
