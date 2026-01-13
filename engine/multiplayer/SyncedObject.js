export class SyncedObject {
    static link(targetClientId, objectId, obj) {
        const proxy = ProxyObject(obj, (key, value) => {
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