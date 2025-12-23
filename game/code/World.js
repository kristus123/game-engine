export class World {
	constructor() {
//		Layout.test()

		this.hasSentMessage = false
		this.targetId = null
		this.text = null

		this.socketClient = new SocketClient()
		this.socketClient.onClientMessage('TEST', message => {
			console.log(`Message "${JSON.stringify(message.data)}" came from ${message.originClientId}.`)
		})
	}

	update() {
		if (Keyboard.up && !this.hasSentMessage) {
			this.targetId = prompt("Enter ClientId")
			this.text = prompt(`Enter The Text You Want To Send To ${this.targetId}`)
		}

		if (this.targetId && this.text && !this.hasSentMessage) {
			this.socketClient.sendToClient("TEST", this.targetId, {msg: this.text})
			this.hasSentMessage = true
		}
		
	}

	draw(draw) {
	}
}
