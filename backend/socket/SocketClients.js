export class SocketClients {

	static {
		this.all = []
		this.ids = []

		this._fromId = {}
		this._idFrom = new WeakMap()
	}

	static add(client, clientId) {
		this.all.push(client)
		this.ids.push(clientId)

		this._fromId[clientId] = client
		this._idFrom.set(client, clientId)
	}

	static remove(client) {
		const clientId = this._idFrom.get(client)

		this.all.remove(client)
		this.ids.remove(clientId)

		delete this._fromId[clientId]
		this._idFrom.delete(client)
	}

	static fromId(clientId) {
		return this._fromId[clientId]
	}

	static idFrom(client) {
		return this._idFrom.get(client)
	}
}
