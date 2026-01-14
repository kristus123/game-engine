// ClientId(

export class OtherConnectedSocketClients {
	static {
		this.clientIds = []

		this.onConnectListener = new Listener()
		this.onDisconnectListener = new Listener()
	}

	static register(callback) {
		callback(this.onConnectListener.register, this.onDisconnectListener.register)
	}

	static add(connectingClientId) {
		if (this.clientIds.includes(clientId)) {
			throw new Error('it should never be able to ADD itself twice')
		}
		else if (connectingClientId == ClientId) {
			console.log('itself will never be added')
		}
		else {
			this.clientIds.push(connectingClientId)
			this.onConnectListener.run(connectingClientId)
		}
	}

	static remove(disconnectingClientId) {
		if (this.clientIds.missing(disconnectingClientId)) {
			throw new Error('it should never be able to REMOVE itself twice')
		}
		else if (disconnectingClientId == ClientId) {
			console.log('itself will never be added')
		}
		else {
			this.clientIds.remove(disconnectingClientId)
			this.onDisconnectListener.run(disconnectingClientId)
		}
	}

	static [Symbol.iterator]() {
		return this.clientIds[Symbol.iterator]()
	}
}
