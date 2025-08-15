export class Money {
	static init() {
		this.amount = 100

		Html.upperRight([
			this.money = Html.p(this.amount),
		])

		this.tilemaps = new Tilemaps()

		this.localObjects = new LocalObjects([
			OnTrue(() => Keyboard.e, () => {
				this.turret = new Turret(Mouse.position.copy())
				Mouse.onClick = p => {
					if (this.tilemaps.touchesTurretTiles(p)) {
						tla(this.turret)
						Sound.click()
						Mouse.onClick = null
						this.turret.motion.start()
						this.turret = null
						Html.changeText(this.money, this.amount)
						this.subtract(20)
					}
				}

				
			}),
		])

		this.turret = null

		Html.upper([
			this.buyTurret = Html.button('default turret', () => {
				this.turret = new Turret(Mouse.position.copy())
				Mouse.onClick = p => {
				    if (this.tilemaps.touchesTurretTiles(p)) {
						tla(this.turret)
						Sound.click()
						Mouse.onClick = null
						this.turret.motion.start()
						this.turret = null
						Html.changeText(this.money, this.amount)
						this.subtract(20)
					}
				}
			}),
		])


		return this
	}

	static update() {
		this.localObjects.update()
	}

	static draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)


		if (Mouse.onClick) {
			draw.rectangle(this.turret)

			this.turret.position.xy(Mouse.position)
			this.turret.draw(draw, guiDraw)

			const valid = this.tilemaps.touchesTurretTiles(Mouse.position)
			draw.color(this.turret, valid ? 'green': 'red')
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
