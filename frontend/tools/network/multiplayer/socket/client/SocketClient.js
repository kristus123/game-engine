// WebSocket.CONNECTING // 0
// WebSocket.OPEN       // 1
// WebSocket.CLOSING    // 2
// WebSocket.CLOSED     // 3

export class SocketClient {

	static {
		this.webSocket = null
		this._connectionPromise = null

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
		const socket = this.webSocket
		const state = socket?.readyState

		switch (state) {
			case WebSocket.OPEN {
				return
			}
			case WebSocket.CONNECTING {
				return this._connectionPromise
			}
			case WebSocket.CLOSING {
				return new Promise(resolve => {
					socket.addEventListener("close", () => resolve(this.connect()), { once: true })
				})
			}
			default {
				break
			}
		}

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

				if (!this._firstConnect) {
					this.onFirstConnect?.()
					this._firstConnect = true
				}

				this.onEveryConnect?.()

				this.sendToServer("HOT_RELOAD_BACKEND_ID", {})

				resolve()
			}

			nextSocket.onerror = () => {
				reject(new Error("Failed to connect to socket server"))
			}

			nextSocket.onclose = () => {
				if (this.webSocket != nextSocket) {
					return
				}

				this._connectionPromise = null
				setTimeout(async () => {
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
		this._connectionPromise = connectionPromise
		connectionPromise.catch(() => {
			if (this.webSocket?.readyState != WebSocket.CONNECTING) {
				this._connectionPromise = null
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
