export class Internet {
	static connected = navigator.onLine
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
		}, 5000)
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
		}, 2000)

		HttpClient.ping({}, (body) => {
			clearTimeout(timeout)
			this.setConnected(body?.connected === true)
		}).catch(() => {
			clearTimeout(timeout)
			this.setConnected(false)
		})
	}
}
