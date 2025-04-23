export class SmokeBomb {
	constructor(player) {

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

			if (Registry.enemies) for (const e of Registry.enemies) {
				if (e.within(350, this.player)) {
					e.markBlinded()
				}
			}
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		draw.hollowCircle(this.player, 'red', 350)
	}
}
