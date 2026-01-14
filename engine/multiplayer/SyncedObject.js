export class SyncedObject {
    static link(targetClientId, objectId, jsObject) {
		objectId = "SYNCED_OBJECT" + objectId + Random.uuid()

        const proxy = ProxyObject(jsObject, (key, value) => {
            SocketClient.sendToClient(objectId, targetClientId, {
                fields: { [key]: value }
            })
        })

        SocketClient.onClientMessage(objectId, data => {
            for (const key in data) {
                proxy[key] = data[key]
            }
        })

        return proxy
    }
}
