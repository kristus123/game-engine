export class World {
	constructor(levelSelector, camera, mouse) {
		this.controller = new Controller()

		this.player = new Player(mouse)

		this.npc = new Npc()

		this.deliveryDrone = new DeliveryDrone(this.player, camera, this.controller, this.player, 0, 400)
		camera.followInstantly(this.deliveryDrone)
		this.controller.control(this.deliveryDrone)

		this.pissQuest = new PissQuest(this)

		this.runAll = new RunAll([
			new StarBackground(camera),
			this.controller,
			new Picture(new GameObject(500, 0, 1500, 1500, 1, 1), '/static/assets/planets/exoplanet32x32.png'),
			this.player,
			{
				draw: draw => draw.gradient(new Position(1250, 750)),
			},
			new Picture(new GameObject(-3491, 2101, 800, 800, 1, 1), '/static/assets/planets/moon27x26.png'),
			new Picture(new GameObject(2100, 5000, 3000, 3000, 1, 1), '/static/assets/planets/sun.png'),
			this.deliveryDrone,
			this.npc,
			this.pissQuest,
		])
	}

	update() {
		this.runAll.update()
	}

	draw(draw, guiDraw) {
		this.runAll.draw(draw, guiDraw)
	}
}
