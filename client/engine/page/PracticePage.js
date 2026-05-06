const db = Db("jap")

const h = F.practiceCard()

h.addMoreCards.onClick(() => {
	Page.go(AddCardPage)
})

let cards = []
let activeCard = null

function init({ includeAll } = {}) {
	Assert.value(includeAll)

	db.all(dbCards => {
		cards = dbCards.filter(c => includeAll || LocalDate(c.nextPracticeDate).isDue())

		practiceNewCard()

		if (cards.empty) {
			h.delete.hide()
		}
	})
}

function practiceNewCard() {
	if (cards.empty) {
		h.practiceMore.show()

		h.activePractice.hide()
		h.easyHard.hide()
	}
	else {
		h.practiceMore.hide()

		h.activePractice.show()
		h.easyHard.show()

		activeCard = cards.random()
		Sound.playBlob(activeCard.front)
	}
}

function applyScore(score) {
	switch (score) {
		case "easy": {
			cards.remove(activeCard)
			const d = (activeCard.score / 2).roundDown()
			activeCard.nextPracticeDate = LocalDate.now().plusDays(d).toString()
			activeCard.score += 1
		}
		case "hard": {
			activeCard.nextPracticeDate = LocalDate.now().toString()
			activeCard.score -= 1
		}
		default: {
			throw new Error("unexpected score type")
		}
	}

	db.update(activeCard)
	practiceNewCard()
}

h.playFront.onClick(() => {
	Sound.playBlob(activeCard.front)
})

h.playBack.onClick(() => {
	Sound.playBlob(activeCard.back)
})

h.easy.onClick(() => {
	applyScore("easy")
})

h.hard.onClick(() => {
	applyScore("hard")
})

h.practiceMoreButton.onClick(() => {
	init({ includeAll: true })
	h.practiceMore.hide()
})

h.delete.onClick(() => {
	db.delete(activeCard, () => {
		cards.remove(activeCard)
		practiceNewCard()
	})
})

init({ includeAll: false })

export const PracticePage = Page.init(h)
