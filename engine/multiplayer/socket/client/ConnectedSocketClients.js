// ClientId(

export class ConnectedSocketClients {
	static {
		this.ids = []

		this.onConnect = (clientId) => {}
		this.onDisconnect = (clientId) => {}
	}

	static add(clientId) {
		if (this.ids.missing(clientId) && clientId != ClientId) {
			this.ids.push(clientId)
			this.onConnect(clientId)
		}
		console.log(this.ids)
	}

	static remove(clientId) {
		if (this.ids.includes(clientId)) {
			this.ids.remove(clientId)
			this.onDisconnect(clientId)
		}
		console.log(this.ids)
	}

	static [Symbol.iterator]() {
		return this.ids[Symbol.iterator]()
	}
}
