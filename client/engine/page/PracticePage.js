const db = Db("jap")
const p = PhoneLayout()
p.top.addClass("red")
p.mid.addClass("white")
p.mid.addClass("center")

let card = null

function practiceRandomCard() {
	const pp = Html.p('loading')
	p.mid.add(pp)
	db.random(c => {
		pp.remove()
		card = c
		Sound.playBlob(card.front)
	})
}

p.top.add(Flex.h([
	H.button("Add more cards", () => {
		Page.go(AddCardPage)
	}),
]))

p.mid.add([
	H.button('play front', () => {
		Sound.playBlob(card.front)
	}).fontSize('50px'),
])

p.mid.add([
	H.button('play back (answer)', () => {
		Sound.playBlob(card.back)
	}).css('margin-top:90px').fontSize('50px'),
])

p.bot.addClass("center")
p.bot.addClass("blue")

p.bot.add(Flex.h([
	H.button("hard", () => {
		card.score -= 1
		db.update(card)
		practiceRandomCard()
	}).fontSize('50px'),
	H.button("easy", () => {
		card.score += 1
		db.update(card)
		practiceRandomCard()
	}).fontSize('50px'),
]).offset_y(-40))

practiceRandomCard()
export const PracticePage = p
