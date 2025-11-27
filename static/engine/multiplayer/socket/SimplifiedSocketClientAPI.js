export class SimplifiedSocketClientAPI {
	constructor(){
		this.socket = new SocketClient(8082)
	}

	send(targetClientId, data)
	{
		this.socket.send({
			action: "CLIENT_TO_CLIENT",
			targetClientId: targetClientId,
			originClientId: this.socket.clientId,
			json: data
		})
	}

	on(callback)
	{
		this.socket.on["CLIENT_TO_CLIENT"] = callback
	}
}
