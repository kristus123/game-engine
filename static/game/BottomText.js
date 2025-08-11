export class BottomText {
	constructor(texts) {
		this.quest = new Quest(texts.map(t => () =>
			new class {
				constructor() {
					Html.lower([
						Html.img(),
						Html.div('big', [
							Html.p(t),
							Html.button('next', () => {
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
	
	draw(draw, guiDraw) {
		this.quest.draw(draw, guiDraw)
	}
}
