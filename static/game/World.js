export class World {
	constructor() {
		Camera.follow(new Position(800, 800))

		this.stopButton = Html.button('stop', () => {
			Microphone.stop(blob => {
				Html.clear()

				const x = Html.input('name of file', fileName => {
				  AudioDb.save(fileName, blob)
					Sound.playBlob(blob)
					reload()
				})

				Html.upper([
					x,
				])

				x.focus()
			})

			Html.clear()
			Html.upper([
				this.recordButton,
			])
		})

		this.recordButton = Html.button('record', () => {
			Microphone.start()

			Html.upper([
				this.stopButton,
			])
		})

		const reload = () => {
			AudioDb.all(entries => {
				const x = entries.map(e => 
					Html.div('big', [
						Html.p(e.key),
						Html.button(e.key, () => {
							console.log(e)
							Sound.playBlob(e.value)
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
		reload()

		Html.upper([
			this.recordButton,
		])
	}

	update() {
	}

	draw(draw) {
	}
}
