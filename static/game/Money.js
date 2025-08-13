export class Money {
	static init() {
		this.amount = 100

		Html.upperRight([
			this.money = Html.p(this.amount),
		])

		this.tilemaps = new Tilemaps()

		Html.upper([
			this.buyTurret = Html.button('buy turret', () => {
				Mouse.onClick = p => {
				    if (this.tilemaps.touchesTurretTiles(p)) {
						tla(new Turret(p.copy()))
						Sound.click()
						Mouse.onClick = null
						Html.changeText(this.money, this.amount)
						this.subtract(20)
					}
				}
			}),
		])

		this.localObjects = new LocalObjects([
		])

		return this
	}

	static update() {
		this.localObjects.update()
	}
	
	static draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)


		if (Mouse.onClick) {
			draw.rectangle(new Position(Mouse.position.x, Mouse.position.y, 100, 100))

			const valid = this.tilemaps.touchesTurretTiles(Mouse.position)
			const p = new Position(Mouse.position.x, Mouse.position.y, 100, 100)
			draw.color(p, valid ? 'green': 'red')
		}
	}

	static increase(amount) {
		this.amount += amount
		Html.changeText(this.money, this.amount)

		if (this.amount > 10) {
			Html.enable(this.buyTurret)
		}
		else {
			Html.disable(this.buyTurret)
		}
	}

	static subtract(amount) {
		this.amount -= amount
		Html.changeText(this.money, this.amount)

		if (this.amount > 10) {
			Html.enable(this.buyTurret)
		}
		else {
			Html.disable(this.buyTurret)
		}
	}
}
