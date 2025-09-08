export class World {
	constructor() {
		Camera.follow(new Position(800, 800))

		this.localObjects = new LocalObjects([
			// G.Sprite.world(new Position(0, 0)).idle.show(0),
			// new GrassGrid(),
			// new HouseGrid(),
		])

		this.stopButton = Html.button('stop', () => {
			Microphone.stop(blob => {
				Html.clear()
				Html.upper([
					Html.input('name of file', fileName => {
					  AudioDb.save(fileName, blob)
						Sound.playBlob(blob)
						Html.clear()
						Html.upper([
							this.recordButton,
						])
					}),
				])
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

				Html.fill([
					Html.div('scroll', x),
				])
			})

		Html.upper([
			this.recordButton,
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw) {
		this.localObjects.draw(draw)
	}
}
