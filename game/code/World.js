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


		const player = new DynamicGameObject(new Position(3000,4000))

		Controller.control(player)
		Camera.followInstantly(player)

		this.localObjects = new LocalObjects([
			Sprite.snow(new Position(0,0), 20),
			Sprite.samurai(player.position),
		])
	}


	update() {
		this.localObjects.update()
	}

	draw(draw) {}
}
