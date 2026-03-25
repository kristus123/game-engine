export class LandingPage {
	static {
		const db = Db("jap")

		const p = PhoneLayout()
		const top = p.top
		const mid = p.mid

		top.addClass("red")

		mid.addClass("white")
		mid.addClass("center")

		mid.add(H.button("start", () => {
			Microphone.start()
			mid.clear()

			mid.add(H.button("stop", () => {
				Microphone.stop(blob => {
					db.save({
						audio: blob,
					})
				})
			}))
		}))

		db.forEach(c => {
			mid.add(H.button(JSON.stringify(c), () => {
				Sound.playBlob(c.audio)
			}))
		})

		p.bot.addClass("blue")

		this.g = p
		Page.init(this) //Must be at bottom
	}

	static show() {
		this.g.show()
	}

	static hide() {
		this.g.hide()
	}
}
