const db = Db("jap")
const p = PhoneLayout()

p.top.addClass("red").add(Flex.h([
	H.button("practice", () => {
		Page.go(PracticePage)
	}).css("font-size:10px;"),
]))

p.mid.addClass("white center")


p.bot.addClass("center blue").add(ToggleButton(
	{
		text: "start",
		onClick: () => {
			Microphone.start()
		},
	},
	{
		text: "stop",
		onClick: () => {
			Microphone.stop(blob => {
				db.save({
					text: "hello",
					audio: blob,
					score: 0,
				}, c => {
					// addCard(c)
				})
			})

		},
	},
).offset_y(-30))

export const LandingPage = Page.init(p)
