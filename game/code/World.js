// ClientId(

export class World {
	constructor() {
		OtherConnectedSocketClients.onConnect = connectingClientId => {
			console.log(connectingClientId)
			const button = Html.button(connectingClientId, () => {
				RtcClient.call(connectingClientId)
			})

			GridUi.left.push(button)

			OtherConnectedSocketClients.onDisconnect = clientId => {
				button.remove()
			}
		}

		RtcClient.onIncomingCall = callerClientId => {
			GridUi.mid.push([
				Html.button('accept call', () => {
					RtcClient.acceptCall(callerClientId)
				}),
			])
		}


		const player = new DynamicGameObject(new Position(8000, 6000))

		Controller.control(player)
		Camera.followInstantly(player)

		this.localObjects = new LocalObjects([
			Sprite.snow(new Position(0, 0), 6),
			Sprite.samurai(player.position, 0.5),
		])

		SocketClient.onServerMessage('UPDATE_CLIENTS_LIST', data => {
			console.log(`Logging From Game: ${JSON.stringify(data)}.`)
		})
	}


	update() {
		this.localObjects.update()
	}

	draw(draw) {}
}
