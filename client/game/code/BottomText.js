export class BottomText {
	constructor(texts) {
		this.quest = Quest(texts.map(t => () =>
			new class {
				constructor() {
					Html.lower([
						Html.img(),
						Html.div("big", [
							Html.p(t),
							Html.button("next", () => {
								Html.clearLower()
								this.completed = () => true
							})
						]),
					])
				}
			}))
	}

	update() {
		this.quest.update()
	}

	draw(draw) {
		this.quest.draw(draw)
	}
}
