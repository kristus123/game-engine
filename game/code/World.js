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

		GridUi.mid.set(Html.button('new obj', () => {
			this.PLAYER = SyncedObject.link(OtherConnectedSocketClients.ids[0], ClientId, { HP: 100 })
			console.log("New Object Created!")
		}))

		GridUi.bottom.set(Html.button('update obj', () => {
			this.PLAYER.HP -= 1
			console.log(`My Player HP: ${this.PLAYER.HP}`)
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
