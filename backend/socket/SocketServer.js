import { WebSocket, WebSocketServer } from "ws"

export class SocketServer {

	static {
		this.actions = {}
		this.server = null

		this.on("USER_TO_USER", ({ userId, data, metaHeaders }) => {

			const targetUserIds = Always.list(Assert.onlyOneValue(
				metaHeaders.targetUserIds, metaHeaders.targetUserId,
			)).assertValues()

			for (const targetUserId of targetUserIds) {
				for (const target of SocketClients.clientsFromUserId(targetUserId)) {
					this.sendToClient(target, {
						data: data,
						metaHeaders: {
							action: "USER_TO_USER",
							subAction: metaHeaders.subAction,
							originUserId: userId,
							targetUserId: targetUserId,
						},
					})
				}
			}
		})
	}

	static start(server, { onJoin, onLeave } = {}) { // no-null-check // todo add async await for this one
		this.server = new WebSocketServer({ server: server })
		this.server.on("connection", async (client, request) => {
			const urlParameters = new URLSearchParams(request.url.split("?")[1])
			let userId
			let closed = false
			const pendingMessages = []

			const handleMessage = m => {
				const message = JSON.parse(m)
				const metaHeaders = message.metaHeaders

				if (this.actions[metaHeaders.action] != null) {
					this.actions[metaHeaders.action]({
						client: client,
						userId: userId,
						data: message.data,
						metaHeaders: metaHeaders,
					})
				}
				else {
					throw new Error(metaHeaders.action + " does not exist")
				}
			}

			client.on("message", m => {
				if (userId == null) {
					pendingMessages.push(m)
				}
				else {
					handleMessage(m)
				}
			})

			client.on("close", () => {
				closed = true
				if (userId == null) {
					return
				}

				const lastConnection = SocketClients.remove(client)
				onLeave?.({ userId: userId, lastConnection: lastConnection })

				console.log(`${userId} has disconnected`)

				if (lastConnection) {
					SfuServer.closeConnectionWithUser(userId)

					this.sendToEveryone({
						data: {
							userIds: SocketClients.userIds,
						},
						metaHeaders: {
							action: "UPDATE_USERS_LIST",
							originUserId: userId,
						},
					})
				}
			})

			try {
				const token = urlParameters.get("token")
				const decodedToken = await ShaToken.decode(token)
				userId = Assert.string(decodedToken.internal.userId)
				Assert.true(userId.length > 0, "Token is missing a user ID")
			}
			catch {
				pendingMessages.length = 0
				client.close(1008, "Invalid token")
				return
			}

			if (closed || client.readyState != WebSocket.OPEN) {
				pendingMessages.length = 0
				return
			}

			SocketClients.add(client, userId)
			onJoin?.({ client: client, userId: userId })

			this.sendToClient(client, {
				data: {},
				metaHeaders: {
					action: "USER_ID",
					originUserId: userId,
				},
			})

			console.log(`${userId} has connected`)

			this.sendToEveryone({
				data: {
					userIds: SocketClients.userIds,
				},
				metaHeaders: {
					action: "UPDATE_USERS_LIST",
					originUserId: userId,
				},
			})

			for (const message of pendingMessages) {
				handleMessage(message)
			}
			pendingMessages.length = 0
		})
	}

	static async stop() {
		const server = this.server
		if (!server) {
			return
		}

		this.server = null
		for (const client of server.clients) {
			client.terminate()
		}

		await new Promise(resolve => server.close(resolve))
	}

	static on(action, callback) {
		if (this.actions[action]) {
			throw new Error("can't add duplicate action: " + action)
		}
		else {
			this.actions[action] = callback
		}
	}

	static sendToOtherUsers(originClient, { data = {}, metaHeaders = {} } = {}) {
		const originUserId = SocketClients.userIdFrom(originClient)
		const targetUserIds = SocketClients.userIds.filter(userId => userId != originUserId)

		this.sendToUsers(targetUserIds, {
			data: data,
			metaHeaders: {
				...metaHeaders,
				originUserId: originUserId,
			},
		})
	}

	static sendToEveryone({ data = {}, metaHeaders = {} } = {}) {
		const clients = [...SocketClients.all]

		this.sendToClients(clients, {
			data: data,
			metaHeaders: metaHeaders,
		})
	}

	static sendToClient(client, { data = {}, metaHeaders = {} } = {}) {
		const userMetaHeaders = { ...metaHeaders, targetUserId: SocketClients.userIdFrom(client) }
		client.send(JSON.stringify({ data: data, metaHeaders: userMetaHeaders }))
	}

	static sendToUser(userId, { data = {}, metaHeaders = {} } = {}) {
		const userMetaHeaders = { ...metaHeaders }
		delete userMetaHeaders.targetUserId
		delete userMetaHeaders.targetUserIds
		userMetaHeaders.targetUserId = userId

		this.sendToClients(SocketClients.clientsFromUserId(userId), {
			data: data,
			metaHeaders: userMetaHeaders,
		})
	}

	static sendToUsers(userIds, { data = {}, metaHeaders = {} } = {}) {
		for (const userId of userIds) {
			this.sendToUser(userId, { data: data, metaHeaders: metaHeaders })
		}
	}

	static sendToClients(clients, { data = {}, metaHeaders = {} } = {}) {
		for (const client of clients) {
			this.sendToClient(client, { data: data, metaHeaders: metaHeaders })
		}
	}

}
