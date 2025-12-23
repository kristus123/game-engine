export class World {
	constructor() {
		this.hasSentMessage = false
		this.targetId = null
		this.text = null

		SocketClient.onClientMessage('TEST', message => {
			console.log(`Message "${JSON.stringify(message.data)}" came from ${message.originClientId}.`)
		})
	}

	update() {
		if (Keyboard.up && !this.hasSentMessage) {
			this.targetId = prompt("Enter ClientId")
			this.text = prompt(`Enter The Text You Want To Send To ${this.targetId}`)
		}

		if (this.targetId && this.text && !this.hasSentMessage) {
			SocketClient.sendToClient("TEST", this.targetId, {msg: this.text})
			this.hasSentMessage = true
		}
	}

	draw(draw) {
	}
}
