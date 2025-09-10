import { Sound } from '/static/engine/audio/Sound.js'; 
import { Html } from '/static/engine/html/Html.js'; 
import { AudioDb } from '/static/engine/os/AudioDb.js'; 
import { Base64 } from '/static/engine/os/Base64.js'; 
import { Db } from '/static/engine/os/Db.js'; 
import { Menu } from '/static/game/memory_cards/Menu.js'; 

export class EditMemories {
	constructor() {


		Html.clear()

		AudioDb.all(entries => {
			Html.fillList([
				Html.div('scroll', [
					...entries.map(e => {
						const div = Html.div('big', [
							Html.p(e.title),
							Html.button('play', () => {
								Sound.playBlob(Base64.decode(e.sound))
							}),
							Html.button('delete', () => {
								AudioDb.delete(e.uuid)
								div.remove()
							}),
						])

						return div
					}),
				]),
				Html.button('go back', () => {
					new Menu()
				}),
			])
		})
	}

	update() {
	}

	draw(draw) {
	}
}
