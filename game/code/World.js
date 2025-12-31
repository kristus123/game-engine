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
	}

	update() {
		Sprite.village(new Position(0,0)).update()
	}

	draw(draw) {}
}
