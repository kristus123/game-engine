// ClientId(

export class World {
	constructor() {
		const player = new DynamicGameObject(new Position(8000, 6000))

		this.PLAYER = null
		this.allObjects = {}

		Controller.control(player)
		Camera.followInstantly(player)

		this.localObjects = new LocalObjects([
			Sprite.snow(new Position(0, 0), 6),
			Sprite.samurai(player.position, 0.5),
		])

		GridUi.mid.set(Html.button('new obj', () => {
			for (const index in OtherConnectedSocketClients.ids) {
				const clientId = OtherConnectedSocketClients.ids[index]
				console.log(`linking object to client ${clientId}`)
				const PLAYER = SyncedObject.link(clientId, 'PLAYER', { HP: 100 })
				this.allObjects[ClientId] = PLAYER
			}
			console.log(`New Object Loaded ${JSON.stringify(this.allObjects)}`)
		}))

		GridUi.bottom.set(Html.button('update obj', () => {
			this.allObjects[ClientId].HP -= 1
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
