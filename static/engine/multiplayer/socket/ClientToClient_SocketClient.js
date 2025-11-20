export class ClientToClient_SocketClient {
	constructor(){
		this.clientId
		this.callbacks = {}

		this.socket = new SocketClient(8082, c => {
			this.clientId = c.clientId

			c.on("CLIENT_TO_CLIENT", data => {
				console.log(`${data.originClientId} is talking to ${data.targetClientId}.`)
				if (data.targetClientId != this.clientId)
				{
					console.log(`Hey You Are ${this.clientId}.`)
					console.log("No Message For You!")
					return
				}

				const callback = this.callbacks["CLIENT_TO_CLIENT"]
				
				if (callback) {
					callback(data.json)
				}
				
				console.log(`message from: ${data.originClientId} -> ${JSON.stringify(data.json)}`)
			})
		})

	}
	send(targetClientId, data)
	{
		this.socket.send({
			action: "CLIENT_TO_CLIENT",
			targetClientId: targetClientId,
			originClientId: this.clientId,
			json: data
		})
	}
	on(callback)
	{
		this.callbacks["CLIENT_TO_CLIENT"] = callback
	}
}
