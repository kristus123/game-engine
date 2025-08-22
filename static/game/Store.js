export class Store {
	static init() {
		this.turret = null

		this.tileSheet = G.TileSheet.world,
		this.localObjects = new LocalObjects([


			OnTrue(() => Keyboard.e, () => {
				this.turret = new Turret(Mouse.position.copy())
				Sound.click()
				Mouse.onClick = p => {
					if (this.tileSheet.touchesTurretTiles(p)) {
						tla(this.turret)
						Sound.click()
						Mouse.onClick = null
						this.turret.motion.start()
						this.turret = null
						Money.subtract(20)
					}
				}
			}),

			OnTrue(() => Keyboard.r, () => {
				Sound.click()
				G.allies.add(new Ally(G.player.position.copy()))
			}),


		])


		Html.upper([
			this.buyTurret = Html.button('buy turret (press E)', () => {}),
			this.buyAlly = Html.button('buy ally (press R)', () => {}),
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

			const valid = this.tileSheet.touchesTurretTiles(Mouse.position)
			draw.color(this.turret, valid ? 'green': 'red')
		}
	}

}
