export class World {
	constructor() {
		this.hasCalled = false
		this.hasReceived = false
		this.targetId = null
		this.callerId = null

		const topDiv = Html.div('', [])

		Ui.grid({
			top: [
				topDiv,
			],
			mid: [
			],
		})

		setInterval(() => {
			const connectedClientId = Random.uuid()

			topDiv.add(Html.button(connectedClientId, () => {
				console.log('calling client')
			}))
			
		}, 200);
	}

	update() {
	}

	draw(draw) {
	}
}
