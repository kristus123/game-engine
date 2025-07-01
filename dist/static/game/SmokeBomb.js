import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Key } from '/static/engine/controller/keyboard/Key.js'; 
import { SplashParticles } from '/static/engine/graphics/particles/SplashParticles.js'; 
import { Html } from '/static/engine/graphics/ui/html/Html.js'; 
import { Charge } from '/static/engine/mechanics/Charge.js'; 
import { Text } from '/static/engine/mechanics/dialogue/Text.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Registry } from '/static/engine/objects/Registry.js'; 
import { Init } from '/static/game/world/Init.js'; 

export class SmokeBomb {
	constructor(player) {

				AssertNotNull(player, "argument player in " + this.constructor.name + ".js should not be null")
			
		this.player = player; 


		this.localObjects = new LocalObjects([
			Init(this, {
				particles: new SplashParticles(),
				charge: new Charge(1, 100),
			})
		])

		this.e = new Key('e')

		const text = Html.text('')
		this.charge.onExhaust = () => Html.changeText(text, 'smoke bomb recharging')
		this.charge.onReady = () => Html.changeText(text, 'smoke bomb ready')

		Html.addToScreen(
			Html.div('lower-center-ui', [
				Html.div('shoulder-to-shoulder', [
					text,
				])
			]))
	}

	update() {
		this.localObjects.update()

		if (this.e.down && this.charge.ready()) {
			this.particles.random(this.player)
			this.charge.exhaust()

			if (Registry.enemies) {
				for (const e of Registry.enemies) {
					if (e.within(350, this.player)) {
						e.markBlinded()
					}
				}
			}
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		draw.hollowCircle(this.player, 'red', 350)
	}
}
