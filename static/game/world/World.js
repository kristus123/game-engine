export class World {
	constructor() {
		Html.addToScreen(Html.div('lower-center-ui', [
			Html.div('shoulder-to-shoulder', [
					Html.button('hei'),
					Html.button('hei'),
				])
		]))

		this.player = new PlayerEditor().player
		Cam.followInstantly(this.player)
		Controller.control(this.player)

		this.localObjects = new LocalObjects([
			this.player,
			// sword,
			Init(this, [
				{ enemies: new LocalObjects() },
			]),
			Update(() => {
				for (const e of this.enemies.objects) {
					if (e.touches(this.player)) {
						// Push(this.player).awayFrom(e, 100)
					}
				}
			}),
			new StaticPicture(new Position(-100, 0, 1700, 600), '/static/assets/houses.png'),
			new StaticPicture(new Position(-100, -1200, 1700, 600), '/static/assets/houses.png'),
			new CloudParallax(),
			new TalkToShopKeeper(this.player),
			new Rain(this.player.position.offset(-1200, -1000, 2500, 100)),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
