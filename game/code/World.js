export class World {
	constructor() {
		this.hasCalled = false
		this.hasReceived = false
		this.targetId = null
		this.callerId = null
	}

	update() {
		if (Keyboard.up && !this.hasCalled) {
			this.targetId = prompt("Enter ClientId")
		}

		if (Keyboard.down && !this.hasReceived) {
			this.callerId = prompt("Enter CallerId")
		}

		if (this.targetId && !this.hasCalled) {
			RtcClient.call(this.targetId)
			this.hasCalled = true
		}

		if (this.callerId && !this.hasReceived) {
			RtcClient.acceptCall(this.callerId)
			this.hasReceived = true
		}
	}

	draw(draw) {
	}
}
