export class LandingPage {
	static {
		const db = Db('jap')

		const x = PhoneLayout()
		this.g = x

		x.top.addClass("red")
		x.top.add(Flex.h([
			Html.p("hei"),
			Html.p("hei"),
		]))

		x.mid.addClass("white")
		x.mid.add(H.button('start', () => {
			Microphone.start()
		}))

		x.mid.add(H.button('stop', () => {
			Microphone.stop(blob => {
				db.save({
					audio: blob
				})
			})
		}))

		x.mid.add(H.button('create lobby', () => {
			Lobby.create()
		}))

		Lobby.onNewLobby(lobby => {
			x.mid.add(H.button(lobby.lobbyId, () => {
				console.log("click")
				Lobby.join(lobby.lobbyId)
				x.mid.clear()
				x.mid.add(H.p(JSON.stringify(lobby)))
			}))
		})

		db.all(cards => {
			for (const c of cards) {
				x.mid.add(H.button(c, () => {
					Sound.playBlob(c.value.audio)
				}))
			}
		})

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
