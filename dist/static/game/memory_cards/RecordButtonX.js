import { Random } from '/static/engine/Random.js'; 
import { Html } from '/static/engine/html/Html.js'; 
import { AudioDb } from '/static/engine/os/AudioDb.js'; 
import { Base64 } from '/static/engine/os/Base64.js'; 
import { Db } from '/static/engine/os/Db.js'; 
import { Microphone } from '/static/engine/os/Microphone.js'; 

export class RecordButton {
	constructor() {


		Html.clear()

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

							Html.clear()
							Html.fill(this.recordButton)
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

	}

	update() {
	}

	draw(draw) {
	}
}
