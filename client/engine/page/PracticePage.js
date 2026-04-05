const db = Db("jap")

const p = F.practiceCard

p.addCards.onClick(() => {
	Page.go(AddCardPage)
})

db.all(cards => {
	let c = null

	function practiceNewCard() {
		if (cards.empty) {
			p.mid.clear()
			p.bot.clear()
			p.mid.add(H.p('all cards pracitced'))
			p.mid.add(H.button('practice one more time'))
		}
		else {
			c = cards.random()
			Sound.playBlob(c.front)

			p.message.text(cards.length + " cards left")
		}
	}

	practiceNewCard()

	function applyScore(score) {
		c.score += score

		db.update(c)

		cards.remove(c)

		practiceNewCard()
	}

	p.playFront.onClick(() => {
		console.log(c)
		Sound.playBlob(c.front)
	})

	p.playBack.onClick(() => {
		Sound.playBlob(c.back)
	})

	p.easy.onClick(() => {
		applyScore(+1)
	})

	p.hard.onClick(() => {
		applyScore(-1)
	})

	p.delete.onClick(() => {
		db.delete(c)
		practiceNewCard
	})

	
})

export const PracticePage = Page.init(p)
