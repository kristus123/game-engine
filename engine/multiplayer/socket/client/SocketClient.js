export class SocketClient {
	constructor(){
		this.clientId
		this.socket = new SimplifiedSocketClientAPI(8082, c => {
			this.clientId = c.clientId
			c.on("UPDATE_CLIENTS_LIST", data =>{
				for (const clientId of data.clientIds) {
					if (!c.connectedClientIds.includes(clientId)) {
						c.connectedClientIds.push(clientId);
					}
				}
				console.log(c.connectedClientIds)
			})
			
			c.on("REMOVE_CLIENT", data => {
				const index = c.connectedClientIds.indexOf(data.clientId)
				c.connectedClientIds.splice(index, 1)
				console.log(c.connectedClientIds)

			})
			
			c.on("CLIENT_TO_CLIENT", data => {
				if (data.targetClientId != c.clientId)
				{
					return
				}
				console.log(`Message: ${data.json}`)
			})
		})

	}

	sendRaw(data) {
		this.socket.send(data)
	}

	sendToServer(data) {
		this.socket.send({
			originClientId: this.clientId,
			json: data
		})
	}
	
	sendToClient(targetClientId, data)
	{
		this.socket.send({
			action: "CLIENT_TO_CLIENT",
			targetClientId: targetClientId,
			originClientId: this.clientId,
			json: data
		})
	}

	on(action, callback)
	{
		this.socket.on(action, callback)
	}
}
