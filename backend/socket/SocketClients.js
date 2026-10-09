export class SocketClients {

	static {
		this.all = []
		this.userIds = []

		this._fromUserId = {}
		this._userIdFrom = new WeakMap()
	}

	static add(client, userId) {
		this.all.push(client)

		if (!this._fromUserId[userId]) {
			this._fromUserId[userId] = []
			this.userIds.push(userId)
		}

		this._fromUserId[userId].push(client)
		this._userIdFrom.set(client, userId)
	}

	static remove(client) {
		const userId = this._userIdFrom.get(client)

		this.all.remove(client)
		this._fromUserId[userId].remove(client)

		const lastConnection = this._fromUserId[userId].empty
		if (lastConnection) {
			this.userIds.remove(userId)
			delete this._fromUserId[userId]
		}

		this._userIdFrom.delete(client)
		return lastConnection
	}

	static clientsFromUserId(userId) {
		return this._fromUserId[userId] || []
	}

	static userIdFrom(client) {
		return this._userIdFrom.get(client)
	}
}
