// ClientId(

export class OtherConnectedSocketClients {
	static {
		this.ids = [] // todo rename to clientIds

		this.onConnect = null
		this.onDisconnect = null
	}

	static listen(o) {
		this.onConnect = Assert.value(o.onConnect)
		this.onDisconnect = Assert.value(o.onDisconnect)

		for (const id of this.ids) {
			this.onConnect.onConnect(id)
		}
	}

	static add(clientId) {
		if (this.ids.missing(clientId) && clientId != ClientId) {
			this.ids.push(clientId)
		}

		if (this.onConnect) {
			this.onConnect(clientId)
		}

		console.log(this.ids)
	}

	static remove(clientId) {
		if (this.ids.includes(clientId)) {
			this.ids.remove(clientId)
			this.onDisconnect(clientId)
		}

		if (this.onDisconnect) {
			this.onDisconnect(clientId)
		}

		console.log(this.ids)
	}

	static [Symbol.iterator]() {
		return this.ids[Symbol.iterator]()
	}
}
