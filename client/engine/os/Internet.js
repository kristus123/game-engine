export class Internet {
	static connected = navigator.onLine
	static pingIntervalMs = 5000
	static pingTimeoutMs = 2000

	static onlineListener = new Listener()
	static offlineListener = new Listener()

	static {
		window.addEventListener("online", () => {
			this.ping()
		})

		window.addEventListener("offline", () => {
			this.setConnected(false)
		})

		this.ping()
		setInterval(() => {
			this.ping()
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
			console.log("Internet: offline")
			this.offlineListener.trigger(false)
		}
		else if (!wasConnected && isConnected) {
			console.log("Internet: online")
			this.onlineListener.trigger(true)
		}
	}

	static ping() {
		if (!navigator.onLine) {
			this.setConnected(false)
			return
		}

		const timeout = setTimeout(() => {
			this.setConnected(false)
		}, this.pingTimeoutMs)

		HttpClient.ping({}, (response) => {
			clearTimeout(timeout)
			this.setConnected(response?.connected === true)
		}).catch(() => {
			clearTimeout(timeout)
			this.setConnected(false)
		})
	}
}
