const db = Db("jap")

const p = F.practiceCard

p.addCards.onClick(() => {
	Page.go(AddCardPage)
})

let cards = []
let activeCard = null

function init({includeAll}) {
	Assert.value(includeAll)

	db.all(dbCards => {
		cards = dbCards.filter(c => includeAll || LocalDate(c.nextPracticeDate).isDue())

		practiceNewCard()

		if (cards.empty) {
			p.delete.hide()
		}
	})
}

function practiceNewCard() {
	if (cards.empty) {
		p.practiceMore.show()

		p.activePractice.hide()
		p.easyHard.hide()
	}
	else {
		p.practiceMore.hide()

		p.activePractice.show()
		p.easyHard.show()

		activeCard = cards.random()
		Sound.playBlob(activeCard.front)
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

p.practiceMoreButton.onClick(() => {
	init({includeAll: true})
	p.practiceMore.hide()
})


p.delete.onClick(() => {
	db.delete(activeCard, () => {
		cards.remove(activeCard)
		practiceNewCard()
	})
})

init({includeAll: false})

export const PracticePage = Page.init(p)
