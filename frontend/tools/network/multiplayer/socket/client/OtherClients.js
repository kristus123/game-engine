export class OtherClients {
	static {
		this.ids = [] // todo rename to clientIds

		this.onJoinListener = Listener()
		this.onLeaveListener = Listener()

		this.onChangeListener = Listener()
	}

	static onJoin(callback) {
		this.onJoinListener.listen((clientId) => callback(clientId, (x) => this.onLeaveListener.listenOnce(x)))
		for (const clientId of this.ids) {
			callback(clientId, (x) => this.onLeaveListener.listenOnce(x))
		}
	}

	static add(clientId) {
		if (this.ids.missing(clientId) && clientId != My.clientId) {
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

	static onCountChange(callback) {
		callback(this.ids.length)

		this.onJoinListener.listen(() => {
			return callback(this.ids.length)
		})

		this.onLeaveListener.listen(() => {
			return callback(this.ids.length)
		})
	}
}
