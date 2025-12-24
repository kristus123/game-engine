export class World {
	constructor() {
		this.list = []

		/*SocketClient.onServerMessage('UPDATE_CLIENTS_LIST', data => {
			this.list = SocketClient.connectedClientIds
		})*/
	}

	update() {
		this.list = SocketClient.connectedClientIds
		Ui.grid({	
			top: [
				Html.p(`[${this.list}]`, 'noClass')
			],
			mid: [],
		})

	}

	draw(draw) {
	}
}
