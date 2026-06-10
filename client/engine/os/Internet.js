export class Internet {
	static connected = false
	static pingIntervalMs = 5000
	static pingTimeoutMs = 2000

	static onlineListener = new Listener()
	static offlineListener = new Listener()

	static {
		this.connected = navigator.onLine

		window.addEventListener("online", () => {
			this.update()
		})

		window.addEventListener("offline", () => {
			this.setConnected(false)
		})

		this.update()
		setInterval(() => {
			this.update()
		}, this.pingIntervalMs)
	}

	static onOnline(callback) {
		this.onlineListener.listen(callback)
	}

	static onOffline(callback) {
		this.offlineListener.listen(callback)
	}

	static setConnected(isConnected) {
		const wasConnected = this.connected
		this.connected = isConnected

		if (wasConnected && !isConnected) {
			this.offlineListener.trigger()
		}
		else if (!wasConnected && isConnected) {
			this.onlineListener.trigger()
		}
	}

	static async update() {
		if (!navigator.onLine) {
			this.setConnected(false)
			return this.connected
		}

		const isConnected = await this.serverConnected()
		this.setConnected(isConnected)
		return this.connected
	}

	static async serverConnected() {
		const controller = new AbortController()
		const timeout = setTimeout(() => {
			controller.abort()
		}, this.pingTimeoutMs)

		try {
			const response = await HttpClient.ping({}, () => {})
			return response !== undefined
		}
		catch (e) {
			return false
		}
		finally {
			clearTimeout(timeout)
		}
	}
}
