// ClientId(

export class ChatDb {
	static {
		this.localChatKeys = []
	}

	static saveKey(uuid) {
		AssertNotNull(uuid)

		this.localChatKeys.push(uuid)
	}

	static all() {
		return this.localChatKeys
	}

	static delete(uuid) {
		const index = this.localChatKeys.indexOf(uuid)
		this.localChatKeys.splice(index)
	}

    static listen_sync() {
        SocketClient.onClientMessage('SYNC_CHATDB', data => {
            SocketClient.sendToClient('SYNC_RESPONSE', data.clientId, { keys: this.localChatKeys });
        });
    }

    static sync_with(clientId) {
        if (!clientId) return;

        SocketClient.sendToClient('SYNC_CHATDB', clientId, { clientId: ClientId });

        SocketClient.onClientMessage('SYNC_RESPONSE', data => {
            console.log(`Sync Data: ${JSON.stringify(data)}`)
			this.localChatKeys = data.keys
            console.log("Sync complete.");
        });
    }
}