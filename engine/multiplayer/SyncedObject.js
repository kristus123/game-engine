// ClientId(

export class SyncedObject {

	static create(objectId, jsObject) {

		const proxyObject = ProxyObject(jsObject, (key, value) => {
			SocketClient.sendToClient(objectId, ClientId, {[key]: value})
		})

		SocketClient.onClientMessage(objectId + "_REQUEST_FIRST_TIME_SYNC", data => {
			SocketClient.sendToClient(objectId + "_FIRST_TIME_SYNC", data.originClientId, proxyObject)
		})

		return proxyObject
	}

	static link(targetClientId, objectId, onFirstTimeSync = () => {}) {
		const proxyObject = ProxyObject({})
		function sync(data) { // temp method
			data.forEach((key, value) => {
				proxyObject[key] = value
			})
		}

		SocketClient.onClientMessage(targetClientId, objectId, data => {
			sync(data)
		})

		SocketClient.onClientMessage(objectId + '_FIRST_TIME_SYNC', data => {
			sync(data)
			onFirstTimeSync(proxyObject)
		})

		SocketClient.sendToClient(targetClientId, objectId + '_REQUEST_FIRST_TIME_SYNC', {})

	}

}
