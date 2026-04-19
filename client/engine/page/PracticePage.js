const db = Db("jap")

const html = F.practiceCard

html.addMoreCards.onClick(() => {
	Page.go(AddCardPage)
})

let cards = []
let activeCard = null

function init({ includeAll }) {
	Assert.value(includeAll)

	db.all(dbCards => {
		cards = dbCards.filter(c => includeAll || LocalDate(c.nextPracticeDate).isDue())

		practiceNewCard()

		if (cards.empty) {
			html.delete.hide()
		}
	})
}

function practiceNewCard() {
	if (cards.empty) {
		html.practiceMore.show()

		html.activePractice.hide()
		html.easyHard.hide()
	}
	else {
		html.practiceMore.hide()

		html.activePractice.show()
		html.easyHard.show()

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

html.playFront.onClick(() => {
	Sound.playBlob(activeCard.front)
})

html.playBack.onClick(() => {
	Sound.playBlob(activeCard.back)
})

html.easy.onClick(() => {
	applyScore(+1)
})

html.hard.onClick(() => {
	applyScore(-1)
})

html.practiceMoreButton.onClick(() => {
	init({ includeAll: true })
	html.practiceMore.hide()
})

html.delete.onClick(() => {
	db.delete(activeCard, () => {
		cards.remove(activeCard)
		practiceNewCard()
	})
})

init({ includeAll: false })

export const PracticePage = Page.init(html)
