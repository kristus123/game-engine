const db = Db("jap")

const p = F.practiceCard

db.all(cards => {

	let c = cards.random()
	Sound.playBlob(c.front)

	function markThing(score) {
		c.score += score
		db.update(c)
		cards.remove(c)
		c = cards.random()

		Sound.playBlob(c.front)
	}

	p.playFront.onClick(() => {
		Sound.playBlob(c.front)
	})

	p.playBack.onClick(() => {
		Sound.playBlob(c.back)
	})

	p.easy.onClick(() => {
		markThing(+1)
	})

	p.hard.onClick(() => {
		markThing(-1)
	})

	
})

export const PracticePage = Page.init(p)
