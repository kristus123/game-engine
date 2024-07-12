export class World {
	constructor() {

		this.player = new PlayerEditor().player
		Cam.followInstantly(this.player)
		Controller.control(this.player)

		this.rice = 0
		this.finished = false

		this.localObjects = new LocalObjects([
			// new StarBackground(),
			new StaticPicture(new Position(-1000,-1000, 2000, 2000), '/static/assets/beach_64x64.png'),
			new StaticPicture(new Position(-1000,-1000, 2000, 2000), '/static/assets/beach_64x64.png'),
			{introMessage: new MultiTextTyper(this.player.position.offset(0, -100), [
				'JEG ER TOM FOR RIS',
				'Jeg får plukke opp alt jeg finner',

			])},
			this.player,
			new Rices(this.player, () => {
				this.localObjects.remove(this.introMessage)
				this.localObjects.add(new Bil(this.player))
			}),
		], this)
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}

}
