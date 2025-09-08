export class World {
	constructor() {
		Camera.follow(new Position(800, 800))

		this.stopButton = Html.button('stop', () => {
			Microphone.stop(blob => {
				Html.clear()

				Html.center([
					this.xx = Html.input('word', title => {
						Base64.encode(blob, sound => {
							const uuid = Random.uuid()
							AudioDb.save(uuid, {
								title: title,
								sound: sound,
								uuid: uuid,
							})

							initAllSounds()
						})
					})
				])

				this.xx.focus()
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
				const x = entries.map(e =>
					Html.div('big', [
						Html.p(e.title),
						Html.button('play', () => {
							Sound.playBlob(Base64.decode(e.sound))
						}),
					]),
				)

				Html.clear()

				Html.fillList([
					Html.button('practice', () => {
						Html.clear()

						const r = Random.choice(entries)
						Sound.playBlob(Base64.decode(r.sound))
						Html.fillList([
							Html.div('big', [
								Html.p('playing audio'),
								Html.div('big', [
									Html.button('hard', () => {
									}),
									Html.button('ok', () => {
									}),
									Html.button('easy', () => {
									}),
								])
							]),
						])
					}),
					this.recordButton,
					Html.div('big', [
						Html.div('scroll', x),
					]),
				])
			})
		}

		initAllSounds()
	}

	update() {
	}

	draw(draw) {
	}
}
