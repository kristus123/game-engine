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
								Audio.playBlob(Base64.decode(e.sound))
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
