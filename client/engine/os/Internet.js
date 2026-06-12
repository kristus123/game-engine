export class Internet {
	static {
		this.connected = navigator.onLine
		this.onlineListener = Listener()
		this.offlineListener = Listener()

		window.addEventListener("online", () => this.ping())
		window.addEventListener("offline", () => this.setConnected(false))

		this.ping()
		setInterval(() => this.ping(), 5000)
	}

	static onOnline(callback) {
		this.onlineListener.listen(callback)
	}

	static onOffline(callback) {
		this.offlineListener.listen(callback)
	}

	static setConnected(isConnected) {
		if (this.connected == isConnected) return
		this.connected = isConnected

		console.log(`Internet: ${isConnected ? "online" : "offline"}`)
		const listener = isConnected ? this.onlineListener : this.offlineListener
		listener.trigger(isConnected)
	}

	static ping() {
		if (!navigator.onLine) {
			this.setConnected(false)
			return
		}

		const timeout = setTimeout(() => this.setConnected(false), 2000)

		HttpClient.ping({}, (response) => {
			clearTimeout(timeout)
			this.setConnected(response?.connected == true)
		}).catch(() => {
			clearTimeout(timeout)
			this.setConnected(false)
		})
	}
}
