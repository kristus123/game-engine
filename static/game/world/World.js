export class World {
	constructor() {

		this.player = new Player(Cam)
		Cam.followInstantly(this.player)
		Controller.control(this.player)

		this.onlineObjects = new OnlineObjects(this.player)

		this.localObjects = new LocalObjects([
			new StarBackground(Cam),
			//new Planet(new Position(0, 0)),
			this.onlineObjects,
			new OnlinePlayers(this.player, Cam),
			this.player,
			new FirstQuest(this.player),
			new Noise(new Position(0, 0, 100, 100)),
		])

		Overlay.bottomButton('hei')
		Overlay.bottomButton('hei')
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}

}
