// ClientId(

export class World {
	constructor() {
		ConnectedSocketClients.onConnect(clientId => {
			GridUi.left.push([
				Html.button(clientId, () => {
					RtcClient.call(clientId)
				}),
			])
		})

		RtcClient.onIncomingCall(callerClientId => {
			GridUi.mid.push([
				Html.button('accept call', () => {
					RtcClient.acceptCall(callerClientId)
				}),
			])
		})
	}

	update() {}

	draw(draw) {}
}
