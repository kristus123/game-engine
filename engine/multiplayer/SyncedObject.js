export class SyncedObject {
	static link(targetClientId, objectId, obj) {
    	const proxy = ProxyObject(obj, (key, value) => {
        	SocketClient.sendToClient('SYNC_OBJECT', targetClientId, {
            	fields: { [key]: value }
        	})
    	})

    	SocketClient.onClientMessage('SYNC_OBJECT', data => {
        	if (!data.fields) {
				return
			}
        	for (const key in data.fields) {
            	proxy[key] = data.fields[key]
        	}
    	})

    	return proxy
	}
}