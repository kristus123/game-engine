export class World {
	constructor() {
		Camera.follow(new Position(800, 800))

		this.localObjects = new LocalObjects([
			// G.Sprite.world(new Position(0, 0)).idle.show(0),
			new GrassGrid(),
			new HouseGrid(),

			OnTrue(() => Keyboard.q, () => {
				this.p.changeText('dirt')
				G.tile = 'dirt'
				Sound.click()
			}),
			OnTrue(() => Keyboard.w, () => {
				this.p.changeText('water')
				G.tile = 'water'
				Sound.click()
			}),
		])

		this.stopButton = Html.button('stop', () => {
			Microphone.stop(blob => {
				  AudioDb.save('myRecording', blob)
				Sound.playBlob(blob)
			})

			Html.clear()
			Html.upper([
				this.recordButton,
			])
		})

		this.recordButton = Html.button('record', () => {
			Microphone.start()

			Html.clear()
			Html.upper([
				this.stopButton,
			])
		})

		Html.upper([
			this.recordButton,
		])

		Html.center([
			Html.div('big', [
				Html.p('hei'),
			])
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw) {
		this.localObjects.draw(draw)
	}
}
