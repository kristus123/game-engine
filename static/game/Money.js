export class Money {
	constructor() {
		this.amount = 100

		Html.upperRight([
			this.money = Html.p(G.money),
		])

		Html.upper([
			this.buyTurret = Html.button('buy turret', () => {
				Mouse.onClick = p => {
					if (new Square(p, 10).touchesAny(this.walkableTiles.filter(t => t.i == 1).map(t => t.position))) {
						tla(new Turret(p.copy()))
						Sound.click()
						Mouse.onClick = null
					}
				}
			}),
		])

		this.localObjects = new LocalObjects([
		])
	}

	update() {
		this.localObjects.update()
	}
	
	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		Html.changeText(this.money, this.amount)
		if (this.amount > 10) {
			Html.enable(this.buyTurret)
		}
		else {
			Html.disable(this.buyTurret)
		}
	}
}
