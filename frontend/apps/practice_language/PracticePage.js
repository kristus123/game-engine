const db = Db("jap")

const html = Html.practiceCard()

html.addMoreCards.onClick(() => {
	console.log("hei")
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
			html.delete.hide()
		}
		else {
			html.delete.show()
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

html.playFront.onClick(() => {
	Sound.playBlob(activeCard.front)
})

html.playBack.onClick(() => {
	Sound.playBlob(activeCard.back)
})

html.easy.onClick(() => {
	applyScore("easy")
})

html.hard.onClick(() => {
	applyScore("hard")
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
