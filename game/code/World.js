export class World {
	constructor() {
		this.clientId = null
		
		Ui.gridAppend('mid', [
			Html.button('Call', () => {
				this.clientId = prompt('Enter Client Id')
				RtcClient.call(this.clientId)
				console.log('calling...')
			})
		])

		Ui.gridAppend('right', [
			Html.button('Answer', () => {
				this.clientId = prompt('Enter Client Id')
				RtcClient.acceptCall(this.clientId)
				console.log('answering...')
			})
		])

	}

	update() {
		Ui.gridReplace('top', [
			Html.p(`[${ConnectedSocketClients.ids}]`, 'noClass')
		])
	}

	draw(draw) {
	}
}
