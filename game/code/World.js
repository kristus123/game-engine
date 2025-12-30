// ClientId(

export class World {
	constructor() {
		ConnectedSocketClients.onConnect = clientId => {
			const b = Html.button(clientId, () => {
				RtcClient.call(clientId)
			})

			GridUi.left.push(b)

			ConnectedSocketClients.onDisconnect = clientId => {
				b.remove()
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
