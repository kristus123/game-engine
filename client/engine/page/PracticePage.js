const db = Db("jap")

const p = F.practiceCard

p.addCards.onClick(() => {
	Page.go(AddCardPage)
})

let cards = []
let c = null

function init() {
	db.all(dbCards => {
		cards = dbCards
		practiceNewCard()
	})
}

function practiceNewCard() {
	if (cards.empty) {
		p.message.text('all cards pracitced')
		p.mid.add(H.button('practice one more time'), (b) => {
			init()
			b.remove()
			practiceNewCard()
		})
	}
	else {
		c = cards.random()
		Sound.playBlob(c.front)
		p.message.text(cards.length + " cards left")
	}
}


function applyScore(score) {
	c.score += score

	db.update(c)

	cards.remove(c)

	practiceNewCard()
}

p.playFront.onClick(() => {
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

init()

export const PracticePage = Page.init(p)
