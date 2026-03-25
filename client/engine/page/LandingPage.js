export class LandingPage {
	static {
		const db = Db("jap")

		const p = PhoneLayout()
		const top = p.top
		const mid = p.mid
		this.mid = p.mid

		top.addClass("red")

		mid.addClass("white")
		mid.addClass("center")

		const button = H.button("start", () => {
			if (Microphone.recording) {
				button.text("start")

				Microphone.stop(blob => {
					const c = db.save({
						text: "hello",
						audio: blob,
					})
					this.addCard(c)
				})
			}
			else {
				button.text("stop")

				Microphone.start()
			}
		})
		mid.add(button)

		db.forEach(c => {
			this.addCard(c)
		})

		p.bot.addClass("blue")

		this.g = p
		Page.init(this) //Must be at bottom
	}

	static addCard(c) {
		const div = H.div().addClass("blue")

		div.css("margin:20px;")
		div.add(H.p(c.text))
		div.add(H.button("play", () => {
			Sound.playBlob(c.audio)
		}))
		div.add(H.button("delete", () => {
			c.delete()
			div.remove()
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
