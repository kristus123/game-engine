export class Store {
	constructor() {
		this.localObjects = new LocalObjects()

		Html.addToScreen(Html.div('upper-center-ui', [
			Html.div('shoulder-to-shoulder', [
				this.x = Html.text(G.money),
				G.buyRanchButton = Html.button('buy ranch (10)', b => {
					G.money -= 10
					this.localObjects.add(new PlaceItems([
						new Ranch(Mouse.position.copy()),
					], i => {
						G.ranches.add(i)
					}))
				}),

				G.buyAnimalButton = Html.button('buy animal (10)', b => {
					G.money -= 10
					this.localObjects.add(new PlaceItems([
						new SimpleMonster(Mouse.position.copy()),
					], i => {
						G.monsters.add(i)
					}))
				}),
			]),
		]))
	}

	update() {
		this.localObjects.update()

		Html.changeText(this.x, G.money)


		if (G.money >= 10) {
			Html.enable(G.buyRanchButton)
		}
		else {
			Html.disable(G.buyRanchButton)
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
