import { G } from '/static/engine/G.js'; 
import { Sound } from '/static/engine/audio/Sound.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { Keyboard } from '/static/engine/controller/keyboard/Keyboard.js'; 
import { Html } from '/static/engine/html/Html.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { OnTrue } from '/static/engine/on/OnTrue.js'; 
import { Ally } from '/static/game/Ally.js'; 
import { Money } from '/static/game/Money.js'; 
import { Tilemaps } from '/static/game/Tilemaps.js'; 
import { Turret } from '/static/game/Turret.js'; 

export class Store {
	static init() {
		this.turret = null

		this.localObjects = new LocalObjects([
			this.tilemaps = new Tilemaps(),


			new OnTrue(() => Keyboard.e, () => {
				this.turret = new Turret(Mouse.position.copy())
				Sound.click()
				Mouse.onClick = p => {
					if (this.tilemaps.touchesTurretTiles(p)) {
						this.localObjects.add(this.turret)
						Sound.click()
						Mouse.onClick = null
						this.turret.motion.start()
						this.turret = null
						Money.subtract(20)
					}
				}
			}),

			new OnTrue(() => Keyboard.r, () => {
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

			const valid = this.tilemaps.touchesTurretTiles(Mouse.position)
			draw.color(this.turret, valid ? 'green': 'red')
		}
	}

}
