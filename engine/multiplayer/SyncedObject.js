export class SyncedObject {
	static me = {}
	static others = {}

	static create(key, obj) {
		objectId = Random.uuid()

		this.me[key] = ProxyObject(obj, (key, value) => {
			
		})

		OtherConnectedSocketClients.onJoin(connectingClientId => {
			SocketClient.sendToClient(connectingClientId, objectId, obj)
		})

		return this.me[key]
	}

	static link(key, jsObject) {
		this.others[key] ??= []

		this.others[key].add(jsObject)
	}
}
