export class World {
	constructor() {
		this.grassTile = new GridTile(Palette.fixedOffscreen(4000, 4000), G.image.grassTile)

		this.rtcClient = new RtcClient()
		this.rtcClient.onData = (data) => {
			console.log('Received data:', data)
		}

		this.rtcClient.startLocalStream().then(() => {
			console.log('Local stream started')
		})

		this.calledPeer = null

		document.addEventListener('keydown', (e) => {
			if (e.key === 'c') {
				const myId = this.rtcClient.client.clientId
				const otherClients = this.rtcClient.client.socket.connectedClientIds.filter(id => id !== myId)
				if (otherClients.length > 0) {
					const targetClientId = otherClients[0]
					console.log(`Calling ${targetClientId}`)
					this.rtcClient.call(targetClientId)
					this.calledPeer = targetClientId
				} else {
					console.log('No other clients to call')
				}
			}

			if (e.key === 'd') {
				if (this.calledPeer) {
					console.log(`Sending data to ${this.calledPeer}`)
					this.rtcClient.send(this.calledPeer, { message: 'Hello from the other side!' })
				} else {
					console.log('You need to call a peer first! Press "c" to call.')
				}
			}
		})
	}

	update() {
		this.grassTile.update()
	}

	draw(draw) {
	}
}
