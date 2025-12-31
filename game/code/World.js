// ClientId(

export class World {
	constructor() {
		ConnectedSocketClients.onConnect = connectingClientId => {
			console.log(connectingClientId)
			console.log("sex")
			const button = Html.button(connectingClientId, () => {
				RtcClient.call(connectingClientId)
			})

			GridUi.left.push(button)

			ConnectedSocketClients.onDisconnect = clientId => {
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


		const player = new DynamicGameObject(new Position(8000,6000))

		Controller.control(player)
		Camera.followInstantly(player)

		this.localObjects = new LocalObjects([
			Sprite.snow(new Position(0,0), 6),
			Sprite.samurai(player.position, 0.5),
		])
	}


	update() {
		this.localObjects.update()
	}

	draw(draw) {}
}
