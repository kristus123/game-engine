// ClientId(

export class World {
	constructor() {
		const div = Dom.overlay()

		OtherConnectedSocketClients.register((onConnect, onDisconnect) => {

			onConnect(connectingClientId => {
			})

			onDisconnect(disconnectingClientId => {

			})
		})
	}


	update() {
	}

	draw(draw) {}
}
