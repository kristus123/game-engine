import { G } from '/static/engine/G.js'; 
import { Sound } from '/static/engine/audio/Sound.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { Keyboard } from '/static/engine/controller/keyboard/Keyboard.js'; 
import { Html } from '/static/engine/html/Html.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { OnChange } from '/static/engine/on/OnChange.js'; 
import { OnTrue } from '/static/engine/on/OnTrue.js'; 
import { Ally } from '/static/game/Ally.js'; 
import { Money } from '/static/game/Money.js'; 
import { Turret } from '/static/game/Turret.js'; 
import { TileSheet } from '/static/game/tiles/TileSheet.js'; 

export class Store {
	static init() {
		this.turret = null

		this.tileSheet = G.TileSheet.world,
		this.localObjects = new LocalObjects([

			new OnTrue(() => Keyboard.e, () => {
				if (Money.moreThan(20)) {
					Sound.click()

					this.turret = new Turret(Mouse.position.copy())
					Mouse.onClick = p => {
						if (this.tileSheet.touchesTurretTiles(p)) {
							Sound.click()

							Money.subtract(20)
							this.localObjects.add(this.turret)

							this.turret.motion.start()
							this.turret = null

							Mouse.onClick = null
						}
					}
				}
			}),

			new OnTrue(() => Keyboard.r, () => {
				if (Money.moreThan(10)) {
					Sound.click()
					Money.subtract(10)

					new Ally(G.player.position.copy())
				}
			}),

			new OnChange(() => Money.amount, () => {
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
