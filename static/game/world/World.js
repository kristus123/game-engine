export class World {
	constructor(levelSelector, allGameObjects, camera, mouse) {
		this.controller = new Controller()

		this.player = new Player(mouse)

		this.npc = new Npc()

		this.deliveryDrone = new DeliveryDrone(this.player, camera, this.controller, this.player, -100, 0)
		camera.followInstantly(this.player)
		this.controller.control(this.player)

		allGameObjects.register(this, [
			new SocketConnection(this.player),
			new StarBackground(camera),
			new Planet(500, 0),
			this.controller,
			this.player,
			this.deliveryDrone,
			this.npc,
		])
	}

	update() {
		if (Collision.between(this.player, this.deliveryDrone)) {
			Push(this.player).awayFrom(this.deliveryDrone, 20)
		}
	}

	draw(draw, guiDraw) {
	}
}
