export class ConnectedSocketClients {
	static {
		this.ids = []

		this.onConnect = (clientId) => {}
		this.onDisconnect = (clientId) => {}
	}

	static add(clientId) {
		if (this.ids.missing(clientId)) {
			this.ids.push(clientId)
			this.onConnect(clientId)
		}
	}

	static remove(clientId) {
		if (this.ids.present(clientId)) {
			this.ids.remove(clientId)
			this.onDisconnect(clientId)
		}
	}

	static [Symbol.iterator]() {
		return this.ids[Symbol.iterator]()
	}
}
