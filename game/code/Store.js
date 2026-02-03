export class Store {
	static init() {
		this.turret = null

		this.localObjects = LocalObjects([

			OnTrue(() => Keyboard.e, () => {
				if (Money.moreThan(20)) {
					Audio.click()

					this.turret = new Turret(Mouse.position.copy())
					Mouse.onClick = p => {
						if (this.x.touchesTurretTiles(p)) {
							Audio.click()

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
					Audio.click()
					Money.subtract(10)

					new Ally(G.player.position.copy())
				}
			}),

			OnChange(() => Money.amount, () => {
				if (Money.lessThan(20)) {
					this.buyTurretText.changeText('need more money')
				}
				else {
					this.buyTurretText.changeText('buy turret x (press E)\'')
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

		if (Mouse.onClick) {
			D1.rectangle(this.turret)

			this.turret.position.xy(Mouse.position)

			const valid = this.x.touchesTurretTiles(Mouse.position)
			D1.color(this.turret, valid ? 'green': 'red')
		}
	}

}
