export class SyncedObject {
	static link(objectId, obj) {
		let suppressSync = false

		const proxy = ProxyObject(obj, (key, value) => {
			if (suppressSync) return

			for (const id of OtherConnectedSocketClients.ids) {
				SocketClient.sendToClient('SYNC_OBJECT', id, {
					objectId,
					fields: { [key]: value }
				})
			}
		})

		SocketClient.onClientMessage('SYNC_OBJECT', data => {
			if (!data.fields || data.objectId !== objectId) return

			suppressSync = true
			for (const key in data.fields) {
				proxy[key] = data.fields[key]
			}
			suppressSync = false
		})

		return proxy
	}
}
