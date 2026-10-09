export class OnlineLobbyManager {
	static {

		this.newLobbyListener = Listener()

		SocketClient.onClientMessage("CLIENT_CREATED_NEW_LOBBY", ({ data, metaHeaders }) => {
			const lobby = Lobbies.createExistingLobby(data.lobbyId, metaHeaders.originUserId, data.userObjects)

			this.newLobbyListener.trigger(lobby)
		})

		SocketClient.onClientMessage("CLIENT_JOINS_LOBBY", ({ data, metaHeaders }) => {
			Lobbies.join(data.lobbyId, metaHeaders.originUserId)
		})

		SocketClient.onClientMessage("CLIENT_LEAVES_LOBBY", ({ data, metaHeaders }) => {
			Lobbies.leave(data.lobbyId, metaHeaders.originUserId)
		})

		SocketClient.onClientMessage("SYNC_EXISTING_LOBBIES", ({ data }) => {
			const lobby = Lobbies.createExistingLobby(data.lobbyId, data.hostUserId, data.userObjects)

			this.newLobbyListener.trigger(lobby)
		})

		SocketClient.onClientMessage("UPDATE_LOBBY_CLIENT_OBJECT", ({ data, metaHeaders }) => {
			const userObject = Lobbies.userObject(data.lobbyId, metaHeaders.originUserId)

			userObject[data.key] = data.value
		})

		OtherUsers.onJoin(newUserId => {
			for (const lobby of Lobbies.myLobbies) {
				SocketClient.sendToUser("SYNC_EXISTING_LOBBIES", newUserId, {
					lobbyId: lobby.lobbyId,
					hostUserId: lobby.hostUserId,
					userIds: lobby.userIds,
					userObjects: Object.fromEntries(Object.entries(lobby.userObjects).map(([userId, userObject]) => [userId, { ...userObject }]))
				})
			}
		})
	}

	static onNewLobby(callback) {
		this.newLobbyListener.listen(callback)
	}

	static updateLobbyObjectField(lobbyId, key, value) {
		SocketClient.sendToOtherUsers("UPDATE_LOBBY_CLIENT_OBJECT", {
			lobbyId: lobbyId,
			key: key,
			value: value,
		})
	}

	static notifyClientCreatedNewLobby(lobby) {
		SocketClient.sendToOtherUsers("CLIENT_CREATED_NEW_LOBBY", {
			lobbyId: lobby.lobbyId,
			userObjects: Object.fromEntries(
				Object.entries(lobby.userObjects).map(([id, obj]) => [id, { ...obj }])
			)
		})
	}

	static notifyClientJoinsLobby(lobbyId) {
		SocketClient.sendToOtherUsers("CLIENT_JOINS_LOBBY", {
			lobbyId: lobbyId,
		})
	}

	static notifyClientLeavesLobby(lobbyId) {
		SocketClient.sendToOtherUsers("CLIENT_LEAVES_LOBBY", {
			lobbyId: lobbyId,
		})

	}
}
