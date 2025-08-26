export class Store {
	static init() {
		this.turret = null

		this.tileSheet = G.TileSheet.world,
		this.localObjects = new LocalObjects([


			OnTrue(() => Keyboard.e, () => {
				if (Money.moreThan(20)) {
					Sound.click()

					this.turret = new Turret(Mouse.position.copy())
					Mouse.onClick = p => {
						if (this.tileSheet.touchesTurretTiles(p)) {
							Sound.click()

							Money.subtract(20)
							tla(this.turret)

							this.turret.motion.start()
							this.turret = null

							Mouse.onClick = null
						}


					}
				}
			}),

			OnTrue(() => Keyboard.r, () => {
				if (Money.moreThan(10)) {
					Sound.click()
					Money.subtract(10)

					new Ally(G.player.position.copy())
				}
			}),

			OnChange(() => Money.amount, () => {
				if (Money.lessThan(20)) {
					Html.changeText(this.buyTurretText, 'need more money')
				}
				else {
					Html.changeText(this.buyTurretText, 'buy turret x (press E)\'')
				}
			}),
		])

		Html.upper([
			this.buyTurretText = Html.p('buy turret (press E)'),
		])

		Html.right([
			this.buyAllyText = Html.p('buy ally (press r)'),
		])

		Html.lower([
			Html.p('Q to jump'),
		])


		return this
	}

	static update() {
		this.localObjects.update()
	}

	static draw(draw) {
		this.localObjects.draw(draw)

		if (Mouse.onClick) {
			draw.rectangle(this.turret)

			this.turret.position.xy(Mouse.position)
			this.turret.draw(draw)

			const valid = this.tileSheet.touchesTurretTiles(Mouse.position)
			draw.color(this.turret, valid ? 'green': 'red')
		}

		this.tileSheet.draw(draw)
	}

}
