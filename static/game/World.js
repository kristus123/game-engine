export class World {
	constructor() {
	//	new Menu()
		this.grassTile = new GridTile(Palette.fixedOffscreen(4000, 4000), G.image.grassTile)
		this.client = new BasicSocketClient()
		this.msgSent = false
	}

	update() {
		this.grassTile.update()
		if (this.client.socket.connectedClientIds.length > 1)
		{
			if (this.msgSent)
			{
				return
			}

			const originClientId = this.client.clientId
			const targetClientId = this.client.socket.connectedClientIds[1]

			console.log(`I am ${originClientId}`)

			if (originClientId === targetClientId)
			{
				this.msgSent = true
				console.log("I am receiving only!")
				return
			}

			console.log(`client message sent to ${this.client.socket.connectedClientIds[1]}!`)
			this.client.send(targetClientId, { text: "Hello, Client!" })

			this.msgSent = true
		}
	}

	draw(draw) {
	}
}
