export class RecordButton {
	constructor() {
		Html.clear()

		
		this.stopButton = Html.button('stop', () => {
			Microphone.stop(blob => {
				Html.clear()

				Html.center([
					this.xxx = Html.input('word', title => {
						Base64.encode(blob, sound => {
							const uuid = Random.uuid()
							AudioDb.save(uuid, {
								title: title,
								sound: sound,
								uuid: uuid,
							})

							Sound.playBlob(blob)

							Html.clear()
							Html.fill([
								this.recordButton
							])

						})
					})
				])

				this.xxx.focus()
			})
		})

		this.recordButton = Html.button('record', () => {
			Microphone.start()

			Html.clear()
			Html.center([
				this.stopButton,
			])
		})

		Html.fill([
			this.recordButton
		])
	}
}
