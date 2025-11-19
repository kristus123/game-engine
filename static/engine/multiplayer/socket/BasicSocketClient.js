export class BasicSocketClient {
	constructor(){
		this.clientId
		this.socket = new SocketClient(8082, c => {
			this.clientId = c.clientId

			console.log(c)

			c.on("MESSAGE", data => {
				console.log(`${data.originClientId} is talking to ${data.targetClientId}.`)
				if (data.targetClientId != this.clientId)
				{
					console.log(`Hey You Are ${this.clientId}.`)
					throw "No Message For You!"
					return
				}
				console.log(`message from: ${data.originClientId} -> ${data.json}`)
			})
		})

	}
	send(targetClientId, data)
	{
		this.socket.send({
			action: "MESSAGE",
			targetClientId: targetClientId,
			originClientId: this.clientId,
			json: data
		})
	}
}
