export class World {
	constructor() {

		const player = new Player(new Position(0,10))
		this.player = player
		Controller.control(player)
		G.player = player

		this.followPlayerNoise = new Noise(new Position(-100,0, 2000, 2000))
		Camera.follow(this.player)

		G.zones = new PicturePositions(G.Pictures.chickenZone, new Position(-200,0)),

		this.localObjects = new LocalObjects([
			Init(this, {
				x: new Picture(new Position(-200,0, 512*4, 320*4), '/static/assets/farm_512x320.png'),
			}),
			new KillingMachine(new Position(100, 100, 20, 20)),
			player,
			new Chicken(new Position(200,0)),
			new Chicken(new Position(200,0)),
			new Chicken(new Position(200,0)),
			new Chicken(new Position(200,0)),
			new Chicken(new Position(200,0)),
			new Chicken(new Position(200,0)),
			new Chicken(new Position(200,0)),
			new Chicken(new Position(200,0)),
			new Chicken(new Position(200,0)),
			new Chicken(new Position(200,0)),
			new Chicken(new Position(200,0)),
			new Chicken(new Position(200,0)),
			new Chicken(new Position(200,0)),
			new Chicken(new Position(200,0)),
			new Chicken(new Position(200,0)),
		])
	}


	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
