const db = Db("jap")
const p = PhoneLayout()

function addCard(c) {
	const div = H.div().addClass("blue").css('min-height:100px;')

	div.css("margin:20px;")
	const pText = H.p(c.text)

	div.add(pText)

	div.add(H.button("play", () => {
		Sound.playBlob(c.audio)
	}))

	div.add(H.button("delete", () => {
		db.delete(c)
		div.remove()
	}))

	div.add(H.button("edit", () => {
		const m = H.modal(H.input("change title", t => {
			c.text = t
			db.update(c)
			pText.text(t)
			m.remove()
		}))
		
	}))

	p.mid.add(div)
}

db.forEach(c => {
	addCard(c)
})

p.top.addClass("red").add(Flex.h([
	H.button('practice', () => {
		Page.go(PracticePage)
	}).css('font-size:10px;'),
]))

p.mid.addClass("white center")

p.bot.addClass('center blue').add([
	H.button("start", b => {
		if (Microphone.recording) {
			b.text("start")

			Microphone.stop(blob => {
				db.save({
					text: "hello",
					audio: blob,
					score: 0,
				}, c => {
					addCard(c)
				})
			})
		}
		else {
			b.text("stop")
			Microphone.start()
		}
	}).css('transform: translateY(-30px); position: relative;')
])

export const LandingPage = Page.init(p)
