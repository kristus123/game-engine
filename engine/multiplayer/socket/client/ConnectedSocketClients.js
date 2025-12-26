export class ConnectedSocketClients {
	static {
		this.ids = []

		this.onConnect = (clientId) => {}
		this.onDisconnect = (clientId) => {}
	}

	static add(clientId) {
		if (!this.ids.includes(clientId)) {
			this.ids.push(clientId)
			this.onConnect(clientId)
		}
	}

	static remove(clientId) {
		if (this.ids.includes(clientId)) {
			const index = this.ids.indexOf(clientId)
			this.ids.splice(index, 1)
			this.onDisconnect(clientId)
		}
	}

	static [Symbol.iterator]() {
		return this.ids[Symbol.iterator]()
	}
}
