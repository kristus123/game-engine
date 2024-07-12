export class World {
	constructor() {

		this.player = new PlayerEditor().player
		Cam.followInstantly(this.player)
		Controller.control(this.player)

		this.localObjects = new LocalObjects([
			// new StarBackground(),
			// new StaticPicture(new Position(-1000,-1000, 2000, 2000), '/static/assets/beach_64x64.png'),
			new MultiTextTyper(this.player.position.offset(0, -100), [
				'JEG ER TOM FOR RIS',
				'Jeg får plukke opp alt jeg finner',

			]),
			...Iterate(2000, () => 
				new Square(Random.direction(this.player.position.offset(700, 0), 500), 1, square => {
					square.update = () => {
						if (Collision.between(this.player, square)) {
							console.log("picked up rice")
							this.localObjects.remove(square)
						}
					}
				})),
			this.player,
		])

		
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}

}
