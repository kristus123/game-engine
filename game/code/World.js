export class World {
	constructor() {
		this.hasCalled = false
		this.hasReceived = false
		this.targetId = null
		this.callerId = null

		Ui.grid({
			top: [
				Html.button('call', () => {
					RtcClient.call('81557be1-87ba-4f7b-97aa-c5bb8d34436e') // this id is normal
				})
			],
			mid: [
				Html.button('answer', () => {
					RtcClient.acceptCall('c5b5087d-c223-4cc9-a63c-ee6601203de4') //this is incognito
				})
			],
		})
	}

	update() {
	}

	draw(draw) {
	}
}
