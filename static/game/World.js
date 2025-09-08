export class World {
	constructor() {
		Camera.follow(new Position(800, 800))

		this.stopButton = Html.button('stop', () => {
				console.log("got blob")
			Microphone.stop(blob => {
				Html.clear()

				const x = Html.input('word', title => {
					Base64.encode(blob, sound => {
						AudioDb.save({
							title: title,
							sound: sound,
						})

						initAllSounds()
					})

				})

				Html.center([
					x,
				])

				x.focus()
			})
		})

		this.recordButton = Html.button('record', () => {
			Microphone.start()

			Html.clear()
			Html.center([
				this.stopButton,
			])
		})

		const initAllSounds = () => {
			AudioDb.all(entries => {
				console.log(entries)
				const x = entries.map(e =>
					Html.div('big', [
						Html.p(e.title),
						Html.button('play', () => {
							Sound.playBlob(e.sound)
						}),
					]),
				)

				Html.clear()
				Html.fillList([
					this.recordButton,
					Html.div('big', [
						Html.div('scroll', x),
					]),
				])
			})
		}
		initAllSounds()

		Html.upper([
			this.recordButton,
		])
	}

	update() {
	}

	draw(draw) {
	}
}
