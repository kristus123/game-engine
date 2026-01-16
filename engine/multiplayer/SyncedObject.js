export class SyncedObject {

	static create(objectId, jsObject) {
		return ProxyObject(jsObject, (key, value) => {
			SocketClient.sendToAll(objectId, {[key]: value})
		})
	}

	static link(targetClientId, objectId, onFirstTimeSync) {
		const proxyObject = ProxyObject({})
		function sync(data) { // temp method
			data.forEach((key, value) => {
				proxyObject[key] = value
			})
		}

		SocketClient.onClientMessageFrom(targetClientId, objectId, data => {
			sync(data)
		})

		SocketClient.onClientMessageFrom(targetClientId, objectId + '_FIRST_TIME_SYNC', data => {
			sync(data)
			onFirstTimeSync(proxyObject)
		})

		SocketClient.sendToClient(targetClientId, 'REQUEST_FIRST_TIME_SYNC', {
			objectId: objectId
		})

	}

}
