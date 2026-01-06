// ClientId(

export class OtherConnectedSocketClients {
	static {
		this.ids = []
		this.clientButtons = new Map()

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
			
			// Clean up button
			const button = this.clientButtons.get(clientId)
			if (button) {
				button.remove()
				this.clientButtons.delete(clientId)
			}
			
			this.onDisconnect(clientId)
		}
		console.log(this.ids)
	}

	static registerButton(clientId, button) {
		this.clientButtons.set(clientId, button)
	}

	static [Symbol.iterator]() {
		return this.ids[Symbol.iterator]()
	}
}
