export class World {
	constructor() {
//		Layout.test()

		this.hasSentMessage = false
		this.targetId = null
		this.text = null

		this.socket_client = new SocketClient()
		this.socket_client.onClientMessage('TEST', message => {
			console.log(`message "${JSON.stringify(message.data)}" from ${message.originClientId}`)
		})
	}

	update() {
		if (Keyboard.up && !this.hasSentMessage) {
			this.targetId = prompt("Enter ClientId")
			this.text = prompt(`Enter The Text You Want To Send To ${this.targetId}`)
		}

		if (this.targetId && this.text && !this.hasSentMessage) {
			this.socket_client.sendToClient("TEST", this.targetId, {msg: this.text})
			this.hasSentMessage = true
		}
		
	}

	draw(draw) {
	}
}
