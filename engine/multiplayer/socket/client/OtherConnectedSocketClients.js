// ClientId(

export class OtherConnectedSocketClients {
	static {
		this.ids = [] // todo rename to clientIds
		this.onJoinListener = new Listener()
		this.onLeaveListener = new Listener()

	}

	static onJoin(callback) {
		this.onJoinListener.listen((clientId) => callback(clientId, (x) => this.onLeaveListener.listenOnce(x)))
		for (const clientId of this.ids) {
			callback(clientId, (x) => this.onLeaveListener.listenOnce(x))
		}
	}

	static add(clientId) {
		console.log('-x-')
		if (this.ids.missing(clientId) && clientId != ClientId) {
			this.ids.push(clientId)
			this.onJoinListener.trigger(clientId)

		}
	}

	static remove(clientId) {
		if (this.ids.includes(clientId)) {
			this.ids.remove(clientId)
			this.onLeaveListener.trigger(clientId)
		}
	}

	static [Symbol.iterator]() {
		return this.ids[Symbol.iterator]()
	}
}
