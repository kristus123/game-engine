// WebSocket.CONNECTING // 0
// WebSocket.OPEN       // 1
// WebSocket.CLOSING    // 2
// WebSocket.CLOSED     // 3

export class SocketClient {

	static {
		this.webSocket = null
		this._connectionPromise = null
		this._reconnectTimer = null

		this.clientActionListener = ActionListener()
		this.serverActionListener = ActionListener()

		this.onRemovedUser = (userId) => {}

		this.serverActionListener.listen("UPDATE_USERS_LIST", ({ data }) => {
			const userIds = data.userIds.filter(userId => userId != Token.userId)
			const diffs = OtherUsers.userIds.unorderedDiff(userIds)

			for (const d of diffs) {
				if (d.add) {
					OtherUsers.add(d.value)
				}
				else if (d.remove) {
					OtherUsers.remove(d.value)
					this.onRemovedUser(d.value)
				}
			}
		})

		this.serverActionListener.listen("USER_TO_USER", ({ data, metaHeaders }) => {
			this.clientActionListener.trigger(metaHeaders.subAction, { data: data, metaHeaders: metaHeaders })
		})

		this.serverActionListener.listen("USER_ID", ({ metaHeaders }) => {
			Assert.true(metaHeaders.targetUserId == Token.userId, "The socket server returned a different user ID")
		})

		setInterval(() => {
			const shouldCloseSocket = ChaosMonkey.maybe({
				feature: "SOCKET",
				message: "socket connection closed",
				chance: 0.2,
			})
			if (shouldCloseSocket) {
				this.webSocket?.close()
			}
		}, 5_00)
	}

	static async connect() {
		if (this.webSocket?.readyState == WebSocket.OPEN) {
			return
		}
		if (this._connectionPromise != null) {
			return this._connectionPromise
		}

		const connectionPromise = this.waitForBackend().then(() => this.openConnection())
		this._connectionPromise = connectionPromise
		connectionPromise.catch(() => {
			if (this._connectionPromise == connectionPromise) {
				this._connectionPromise = null
			}
		})
		return connectionPromise
	}

	static async waitForBackend() {
		while (true) {
			const response = await LowLevelHttpClient.post({
				routeName: "ping",
				body: {},
				formatBody: response => response,
				timeoutMs: 2_000,
			})
			if (response.ok) {
				const status = await response.body.json()
				if (status.pong && status.ready == true) {
					return
				}
			}

			await new Promise(resolve => setTimeout(resolve, 500))
		}
	}

	static openConnection() {
		const connectionPromise = new Promise((resolve, reject) => {
			ChaosMonkey.maybeCrash({
				feature: "SOCKET",
				message: "failed to connect to socket",
			})
			const socketUrl = new URL(Config.wsUrl)
			socketUrl.searchParams.set("token", Token.encodedToken)
			const nextSocket = new WebSocket(socketUrl)
			this.webSocket = nextSocket

			nextSocket.onopen = () => {
				console.log("WebSocket connection opened")
				this._connectionPromise = null
				clearTimeout(this._reconnectTimer)
				this._reconnectTimer = null

				if (!this._firstConnect) {
					this.onFirstConnect?.()
					this._firstConnect = true
				}

				this.onEveryConnect?.()

				this.sendToServer("HOT_RELOAD_BACKEND_ID", {})

				resolve()
			}

			nextSocket.onclose = () => {
				if (this.webSocket != nextSocket) {
					return
				}

				this.webSocket = null
				this._connectionPromise = null
				reject(new Error("Failed to connect to socket server"))

				if (this._reconnectTimer != null) {
					return
				}
				this._reconnectTimer = setTimeout(async () => {
					this._reconnectTimer = null
					try {
						await this.connect()
					}
					catch (error) {
						console.error(error)
					}
				}, 1000)

				console.error("Socket connection lost")
			}

			nextSocket.onmessage = e => {
				const message = JSON.parse(e.data)

				this.serverActionListener.trigger(message.metaHeaders.action, {
					data: message.data,
					metaHeaders: message.metaHeaders,
				})
			}

		})
		return connectionPromise
	}

	static async connectIfNotConnected() {
		return this.connect()
	}

	static sendToServer(action, data={}, additionalMetaHeaders = {}) {

		Assert.true(this.connected, "Not allowed to call .send() if socket connection not open.")

		Retry(3, () => {
			ChaosMonkey.maybeCrash({
				feature: "SOCKET",
				message: "socket failed to send message",
			})
			this.webSocket.send(JSON.stringify({
				data: data,
				metaHeaders: {
					...additionalMetaHeaders,
					action: action,
					originUserId: Token.userId,
				},
			}))
		})
	}

	static sendToUser(subAction, targetUserIds, data) {
		const userIds = Array.isArray(targetUserIds) ? targetUserIds : [targetUserIds]

		if (userIds.empty) {
			return
		}

		const targetHeaders = Array.isArray(targetUserIds)
			? { targetUserIds: userIds }
			: { targetUserId: targetUserIds }

		this.sendToServer("USER_TO_USER", data, {
			...targetHeaders,
			subAction: subAction,
		})
	}

	static sendToOtherUsers(subAction, data) {
		this.sendToUser(subAction, [...OtherUsers.userIds], data)
	}

	static sendToAllUsers(subAction, data) {
		this.sendToUser(subAction, [...OtherUsers.userIds, Token.userId], data)
	}

	static onServerMessage(action, callback) {
		this.serverActionListener.listen(action, callback)
	}

	static onClientMessage(action, callback) {
		this.clientActionListener.listen(action, callback)
	}

	static get connected() {
		return this.webSocket?.readyState == WebSocket.OPEN
	}
}
