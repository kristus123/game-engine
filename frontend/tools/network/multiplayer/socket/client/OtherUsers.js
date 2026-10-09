export class OtherUsers {
	static {
		this.userIds = []

		this.onJoinListener = Listener()
		this.onLeaveListener = Listener()

		this.onChangeListener = Listener()
	}

	static onJoin(callback) {
		this.onJoinListener.listen((userId) => callback(userId, (x) => this.onLeaveListener.listenOnce(x)))
		for (const userId of this.userIds) {
			callback(userId, (x) => this.onLeaveListener.listenOnce(x))
		}
	}

	static add(userId) {
		if (this.userIds.missing(userId) && userId != Token.userId) {
			this.userIds.push(userId)
			this.onJoinListener.trigger(userId)
		}
		else {
			console.warn(`Received an existing user ID: ${userId}`)
		}
	}

	static remove(userId) {
		if (this.userIds.includes(userId)) {
			this.userIds.remove(userId)
			this.onLeaveListener.trigger(userId)
		}
	}

	static [Symbol.iterator]() {
		return this.userIds[Symbol.iterator]()
	}

	static onCountChange(callback) {
		callback(this.userIds.length)

		this.onJoinListener.listen(() => {
			return callback(this.userIds.length)
		})

		this.onLeaveListener.listen(() => {
			return callback(this.userIds.length)
		})
	}
}
