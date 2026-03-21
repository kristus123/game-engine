// ClientId(

export class OtherClients {
	static {
		this.ids = [] // todo rename to clientIds
		this.onJoinListener = Listener()
		this.onLeaveListener = Listener()
		this.onReadyListener = Listener()
	}

	static onReady(callback) {
    	if (OtherClients.ids.length > 0) {
        	callback()
    	}
		else {
        	this.onReadyListener.listenOnce(callback)
    	}
	}

	static onJoin(callback) {
		this.onJoinListener.listen((clientId) => callback(clientId, (x) => this.onLeaveListener.listenOnce(x)))
		for (const clientId of this.ids) {
			callback(clientId, (x) => this.onLeaveListener.listenOnce(x))
		}
	}

	static add(clientId) {
		console.log("-x-")

		if (this.ids.missing(clientId) && clientId != ClientId) {
			this.ids.push(clientId)
			this.onJoinListener.trigger(clientId)
			this.onReadyListener.trigger()
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
