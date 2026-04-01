const db = Db("jap")

const p = PhoneLayout()

let front = null
let back = null

let frontButton = null
let backButton = null

p.top.addClass("red").add(Flex.h([
	H.button("practice", () => {
		Page.go(PracticePage)
	}).css("font-size:50px;"),
]))

p.mid.addClass("white center")

p.mid.add(Flex.v([
	frontButton = ToggleButton(
		{
			text: "start record front",
			onClick: (b, toggle) => {
				Microphone.start()
				toggle()
			},
		},
		{
			text: "stop record front",
			onClick: (b, toggle) => {
				Microphone.stop(blob => {
					front = blob
					toggle()
					b.text("front recorded (click to record again)")
				})
			},
		},
	),
	backButton = ToggleButton(
		{
			text: "start record back",
			onClick: (b, toggle) => {
				Microphone.start()
				toggle()
			},
		},
		{
			text: "stop record back",
			onClick: (b, toggle) => {
				Microphone.stop(blob => {
					back = blob
					toggle()
					b.text("back recorded (click to record again)")
				})
			},
		},
	),
]))

p.bot.add(H.button("save", () => {
	db.save({
		text: "hello",
		front: front,
		back: back,
		score: 0,
	}, c => {
		frontButton.text("start record front")
		backButton.text("start record back")
	})
}))

p.bot.addClass("center blue")

export const AddCardPage = Page.init(p)
