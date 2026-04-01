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

const xxx = Flex.h([
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
	H.button("play audio", () => {
		Sound.playBlob(front)
	})
])

const yyy = Flex.h([
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
	H.button("play", () => {
		Sound.playBlob(back)
	})
])

p.mid.add(Flex.v([
	xxx,
	yyy,
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
