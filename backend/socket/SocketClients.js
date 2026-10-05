export class SocketClients {

	static {
		this.all = []
		this.ids = []

		this._fromId = {}
		this._idFrom = {}
	}

	static add(client, clientId) {
		this.all.push(client)
		this.ids.push(clientId)

		this._fromId[clientId] = client
		this._idFrom[client] = clientId
	}

	static remove(client) {
		const clientId = this._idFrom[client]

		this.all.remove(client)
		this.ids.remove(clientId)

		delete this._fromId[clientId]
		delete this._idFrom[client]
	}

	static fromId(clientId) {
		return this._fromId[clientId]
	}
}
