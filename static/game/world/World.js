export class World {
	constructor() {
		Html.addToScreen(
			Html.div('upper-center-ui', [
				Html.div('shoulder-to-shoulder', [
					Ref(this, { hp: Html.text('hp') }),
				])
			]))

		this.player = new PlayerEditor().player

		this.localObjects = new LocalObjects([
			new WorldEditor().exitEditMode(),
			this.player,
			new StaticPicture(new Position(-100, 0, 1700, 600), '/static/assets/houses.png'),
			new StaticPicture(new Position(-100, -1200, 1700, 600), '/static/assets/houses.png'),
			new CloudParallax(),
			new TalkToShopKeeper(this.player),
			new Rain(this.player.position.offset(-1200, -1000, 2500, 100)),
		])

		Cam.followInstantly(this.player)
		Controller.control(this.player)
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
