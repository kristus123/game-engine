export class World {
	constructor() {

		// this.player = new PlayerEditor().player
		// Cam.follow(this.player)
		// Cam.anchoredPositions.add(new Anchor(Controller.velocity.position, 500, 2, 0.005))
		// Cam.anchoredPositions.add(new Anchor(Mouse.position, 100, 0.2, 0.005))

		Controller.control(this.player)
		const simpleMonster = new SimpleMonster()
		Cam.follow(simpleMonster.position.center)


		this.localObjects = new LocalObjects([
			simpleMonster,
			// new InvisibleWalls(),
			// new WorldEditor().exitEditMode(),
			// new DragonRoom(this.player),
			// this.player,
			// new SmokeBomb(this.player),
			// new Enemy(this.player.position.offset(300).copy()),
			// new Picture(new Position(0, 0, 123*5, 68*5), '/static/assets/logo.png'),
			// new SmoothPosition(new Position(0, 0), Mouse.position, 0.1),
			// new Npc(new Position(0, 0)),
			// new CloudParallax(),
			// new Rain(this.player.position.offset(-1200, -1000, 2500, 100)),
			// new TalkToShopKeeper(this.player),
		])


		Html.addToScreen(
			Html.div('lower-center-ui', [
				Html.div('shoulder-to-shoulder', [
					Html.button('Feed', () => {
						simpleMonster.hunger += 10
						Html.fadeaway('wise choice')
					}),
					Html.button('Poop'),
					Html.button('Poop'),
				])
			]))
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
		// draw.test(new Position(0, 0))
	}
}
