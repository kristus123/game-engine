export class World {
	constructor() {


		Html.addToScreen(
			Html.div('upper-center-ui', [
				Html.div('shoulder-to-shoulder', [
					Html.text('time to poop'),
				])
			]))

		Mouse.addOnClick('hei', () => {
			const text = Html.p('picked up a sword')
			text.setAttribute('class', 'ui fade-away')

			text.style.left = `${Mouse.screenPosition.x}px`
			text.style.top = `${Mouse.screenPosition.y - 50}px`

			Html.addToScreen(text)

			setTimeout(() => {
				Html.remove(text)
			}, 1000)
		})

		this.player = new PlayerEditor().player
		Cam.follow(this.player)
		Controller.control(this.player)

		this.localObjects = new LocalObjects([
			// new WorldEditor().exitEditMode(),
			// new DragonRoom(this.player),
			this.player,
			new Enemy(this.player.position.offset(200).copy(), this.player),
			// new SmoothPosition(new Position(0, 0), Mouse.position, 0.1),
			// new Npc(new Position(0, 0)),
			// new CloudParallax(),
			// new Rain(this.player.position.offset(-1200, -1000, 2500, 100)),
			// new TalkToShopKeeper(this.player),
		])

	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
		draw.test(new Position(0,0))
	}
}
