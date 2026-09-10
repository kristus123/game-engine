export const CardDb = (() => { // no-null-check

	const db = Db("jap")

	return {
		random: (callback) => {
			db.random(callback)
		},
		saveNew: (card, callback) => {
			db.save({
				front: Assert.value(card.front),
				back: Assert.value(card.back),
				score: 0,
				nextPracticeDate: LocalDate.now().toString(),
			}, () => {
				callback()
			})
		},
		markEasy: (card, callback) => {
			card.score += 1
			card.nextPracticeDate = LocalDate.now().toString()
			db.update(card, callback)
		},
		markHard: (card, callback) => {
			card.nextPracticeDate = LocalDate.now().toString()
			db.update(card, callback)
		},
	}
})()
