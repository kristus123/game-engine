export class World {
	constructor() {
		const x = PhoneLayout()

		x.top.addClass("red")
		x.top.add(Flex.h([
			Html.p("hei"),
			Html.p("hei"),
		]))

		x.mid.addClass("white")
		Microphone.start()
		setTimeout(() => {
			Microphone.stop(blob => {
				console.log("sfinished")
				console.log(blob)
				Audio.playBlob(blob)
			})
		}, 500);

		x.bot.addClass("blue")
		x.bot.add(H.p("hei").addClass('glow'))
	}

	update() {
	}
}
