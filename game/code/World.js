// ClientId(

export class World {
	constructor() {
		ConnectedSocketClients.onConnect = clientId => {
			const button = Html.button(clientId, () => {
				RtcClient.call(clientId)
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

	update() {}

	draw(draw) {}
}
