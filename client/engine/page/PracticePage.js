const db = Db("jap")

const p = F.practiceCard

p.addCards.onClick(() => {
	Page.go(AddCardPage)
})

let cards = []
let totalCardsInDb = 0
let activeCard = null

function init({includeAll}) {
	Assert.value(includeAll)

	db.all(dbCards => {
		totalCardsInDb = dbCards.length
		cards = dbCards.filter(c => includeAll || LocalDate(c.nextPracticeDate).isDue())

		practiceNewCard()

		if (cards.empty) {
			p.delete.hide()
		}
	})
}

function practiceNewCard() {
	if (cards.empty) {
		p.message.text(`all cards pracitced (total cards in db = ${totalCardsInDb})`)
		p.mid.add(H.button("practice all cards one more time", b => {
			init({includeAll: true})
			b.remove()
		}))

		p.buttons.hide()
	}
	else {
		p.buttons.show()
		activeCard = cards.random()
		Sound.playBlob(activeCard.front)
		p.message.text(cards.length + " cards left")
	}
}

function applyScore(score) {
	Assert.either(score, [-1, 1])

	activeCard.score += score

	if (score >= 1) {
		cards.remove(activeCard)
		const d = (activeCard.score / 2).roundDown()
		activeCard.nextPracticeDate = LocalDate.now().plusDays(d).toString()
	}
	else if (score <= 1) {
		activeCard.nextPracticeDate = LocalDate.now().toString()
	}

	db.update(activeCard)
	practiceNewCard()
}

p.playFront.onClick(() => {
	Sound.playBlob(activeCard.front)
})

p.playBack.onClick(() => {
	Sound.playBlob(activeCard.back)
})

p.easy.onClick(() => {
	applyScore(+1)
})

p.hard.onClick(() => {
	applyScore(-1)
})

p.delete.onClick(() => {
	db.delete(activeCard, () => {
		cards.remove(activeCard)
		practiceNewCard()
	})
})

init({includeAll: false})

export const PracticePage = Page.init(p)
