export class World {
	constructor() {
		this.list = []

		Ui.grid({
			top: [
				Html.p(`[${this.list}]`, 'noClass')
			],
			mid: [
				Html.button('Click Me', () => {
					console.log('click')
				})
			],
		})
	}

	update() {
		this.list = SocketClient.connectedClientIds
	}

	draw(draw) {
	}
}
