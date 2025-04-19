export class Store {
	constructor() {
		this.localObjects = new LocalObjects()

		Html.addToScreen(Html.div('upper-center-ui', [
			Html.div('shoulder-to-shoulder', [

				this.amountOfMoney = Html.text(G.money),

				G.buyRanchButton = Html.button('buy ranch (10)', () => {
					G.money -= 10

					tla(new PlaceItems(new Ranch(Mouse.position.copy()), i => {
						G.ranches.add(i)
					}))
				}),

				G.buyAnimalButton = Html.button('buy animal (10)', () => {
					G.money -= 10

					tla(new PlaceItems(new SimpleMonster(Mouse.position.copy()), monster => {
						G.monsters.add(monster)
					}))
				}),

				G.hireWorkerButton = Html.button('hire worker (10)', () => {
					G.money -= 10

					G.workers.add(new Worker(new Position(0, 0)))
				}),

				G.buyTreeButton = Html.button('buy tree (10)', () => {
					G.money -= 10

					tla(new PlaceItems([
						new Tree(Mouse.position.copy()),
						new Tree(Mouse.position.copy()),
						new Tree(Mouse.position.copy()),
					], tree => {
						G.trees.add(tree)
					}))
				}),

				G.buyFireButton = Html.button('buy fire (10)', () => {
					G.money -= 10

					tla(new PlaceItems([
						new HorizontalSprite(Mouse.position.copy().size(200, 300), '/static/assets/fire_16x28.png'),
						// new Fire(Mouse.position.copy()),
					], fire => {
						G.fire.add(fire)
					}))
				}),

			]),
		]))
	}

	update() {
		this.localObjects.update()

		Html.changeText(this.amountOfMoney, G.money)

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
