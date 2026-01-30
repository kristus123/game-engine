// ClientId(

export class World {
	constructor() {
		const grid = new GridTemplate()

		for (const [text, nextChoice] of Viking.choices) {
			grid.bot.add(Html.button(c.text, () => {
				grid.bot.clear()
				c.onSelect()
			}))
		}


	}

	update() {

	}
}
