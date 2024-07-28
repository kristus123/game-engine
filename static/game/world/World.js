export class World {
	constructor() {
		Html.addToScreen(
			Html.div('upper-center-ui', [
				Html.div('shoulder-to-shoulder', [
					Ref(this, { hp: Html.text('hp') }),
				])
			]))

		this.player = new PlayerEditor().player

		const sprite = new HorizontalSprite(new Position(0, 0, 400, 400), '/static/assets/blowing_tree_32x32.png', 150)

		this.localObjects = new LocalObjects([
			new WorldEditor().exitEditMode(),
			this.player,
			new CloudParallax(),
			new Rain(this.player.position.offset(-1200, -1000, 2500, 100)),
			new TalkToShopKeeper(this.player),
			sprite,
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
