export class OtherClients {
	static {
		this.ids = [] // todo rename to clientIds
		this.onJoinListener = Listener()
		this.onLeaveListener = Listener()
	}

	static onJoin(callback) {
		this.onJoinListener.listen((clientId) => callback(clientId, (x) => this.onLeaveListener.listenOnce(x)))
		for (const clientId of this.ids) {
			callback(clientId, (x) => this.onLeaveListener.listenOnce(x))
		}
	}

	static add(clientId) {
		if (this.ids.missing(clientId) && clientId != ClientId) {
			this.ids.push(clientId)
			this.onJoinListener.trigger(clientId)
		}
		else {
			// remove console.warn later when we have a sensible way of handling ids on browsers
			console.warn("remember that chrome incognito and chrome normal will contain their ids even after refresh")
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
