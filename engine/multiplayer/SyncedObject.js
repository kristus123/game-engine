export class SyncedObject {
	static me = {}
	static others = {}

	static create(key, obj) {
		this.me[key] = ProxyObject(obj, (key, value) => {
			
		})

		OtherConnectedSocketClients.onJoin(connectingClientId => {
			SocketClient.sendToClient(connectingClientId, 'SYNCED_OBJECT' + key, obj)
		})

		return this.me[key]
	}

	static link(key, jsObject) {
		this.others[key] ??= []

		this.others[key].add(jsObject)
	}
}
