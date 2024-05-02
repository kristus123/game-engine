export class World {
	constructor(levelSelector, allGameObjects, camera, mouse, controller) {

		const client = new SocketClient()
		client.on("WORLD", (client, data) => {
			console.log(data)
		})

		this.player = new Player(mouse)
		camera.followInstantly(this.player)
		controller.control(this.player)

		this.deliveryDrone = new DeliveryDrone(this.player, camera, controller, new Position(2000, 2000), -100, 0)

		allGameObjects.register(this, [
			new StarBackground(camera),
			new Planet(500, 0),
			this.player,
			this.deliveryDrone,
		])

		ObjectPersistence.get().forEach(o => {
			allGameObjects.add(this, o)
		})
	}

	update() {
	}

	draw(draw, guiDraw) {
	}
}
