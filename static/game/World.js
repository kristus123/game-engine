export class World {
	constructor(levelSelector, camera, mouse) {
		this.controller = new Controller()

		this.player = new Player(mouse)

		this.npc = new Npc()

		this.deliveryDrone = new DeliveryDrone(this.player, camera, this.controller, this.player, -100, 0)
		camera.followInstantly(this.deliveryDrone)
		this.controller.control(this.deliveryDrone)

		this.runAll = new RunAll([
			new StarBackground(camera),
			new Planet(500, 0),
			new Picture(new GameObject(-3491, 2101, 800, 800, 1, 1), '/static/assets/planets/moon27x26.png'),
			new Picture(new GameObject(2100, 5000, 3000, 3000, 1, 1), '/static/assets/planets/sun.png'),
			this.controller,
			this.player,
			this.deliveryDrone,
			this.npc,
		])
	}

	update() {
		this.runAll.update()
	}

	draw(draw, guiDraw) {
		this.runAll.draw(draw, guiDraw)
	}
}
