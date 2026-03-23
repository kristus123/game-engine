export class World {
	constructor() {
		const x = PhoneLayout()
		x.top.addClass('red')
		x.top.add(Flex.h([
			Html.p('hei'),
			Html.p('hei'),
		]))

		x.mid.addClass('white')
		x.mid.add(H.button('start record', () => {
			Microphone.start()
			console.log("sex")
		}))
		x.mid.add(H.button('stop record', () => {
			Microphone.stop(blob => {
				console.log(blob)
				Audio.playBlob(blob)
			})
		}))

		x.mid.add(H.img('https://i.pinimg.com/736x/a6/e2/ce/a6e2ce1c7aac11bcba9c066fccfe1507.jpg'))

		x.bot.addClass('blue')
		x.bot.add(H.p('hei'))
	}

	update() {
	}
}
