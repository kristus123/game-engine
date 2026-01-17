// ClientId(

export class World {
	constructor() {
		this.others = {}

		SocketClient.listen('pos', data => {
			console.log(data)

			this.others[data.originClientId] ??= new DynamicGameObject(new Position(0, 0))

			this.others[data.originClientId].x = data.x
			this.others[data.originClientId].y = data.y
		})

		this.player = new DynamicGameObject(new Position(0, 0))
		Controller.control(this.player)

		this.localObjects = new LocalObjects([
			this.samurai = Sprite.samurai(this.player.position),
		])

	}

	update() {
		this.localObjects.update()

		for (const otherClientId of OtherConnectedSocketClients.ids) {
			SocketClient.sendToClient('pos', otherClientId, {
				x: this.player.position.x,
				y: this.player.position.y,
			})
		}

		this.others.forEach((clientId, pos) => {
			Sprite.samurai(pos.position).update()
		})
	}

	draw(draw) {}
}
