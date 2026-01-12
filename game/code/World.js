// ClientId(

export class World {
	constructor() {
		const player = new DynamicGameObject(new Position(8000, 6000))

		this.PLAYER = null

		Controller.control(player)
		Camera.followInstantly(player)

		this.localObjects = new LocalObjects([
			Sprite.snow(new Position(0, 0), 6),
			Sprite.samurai(player.position, 0.5),
		])

		GridUi.top.set(Html.input('clientId', (value) => {
			this.PLAYER = SyncedObject.link(value, 'PLAYER', { HP: 100, name: 'Alice' })
			this.PLAYER.HP -= 10
		}))

		SocketClient.onClientMessage('UPDATE_CLIENTS_LIST', data => {
			console.log(`Logging From Game: ${JSON.stringify(data)}.`)
		})
	}


	update() {
		this.localObjects.update()
	}

	draw(draw) {}
}
