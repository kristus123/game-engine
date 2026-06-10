export class Internet {
	static connected = false
	static pingIntervalMs = 5000
	static pingTimeoutMs = 2000

	static {
		this.connected = navigator.onLine

		window.addEventListener("online", () => {
			this.update()
		})

		window.addEventListener("offline", () => {
			this.connected = false
		})

		this.update()
		setInterval(() => {
			this.update()
		}, this.pingIntervalMs)
	}

	static async update() {
		if (!navigator.onLine) {
			this.connected = false
			return this.connected
		}

		this.connected = await this.serverConnected()
		return this.connected
	}

	static async serverConnected() {
		const controller = new AbortController()
		const timeout = setTimeout(() => {
			controller.abort()
		}, this.pingTimeoutMs)

		try {
			const response = await fetch(`${Config.httpUrl}/internetPing`, {
				body: JSON.stringify({}),
				cache: "no-store",
				headers: {
					"Content-Type": "application/json",
				},
				method: "POST",
				signal: controller.signal,
			})

			const json = await response.json()

			return response.ok && json.connected == true
		}
		catch (e) {
			return false
		}
		finally {
			clearTimeout(timeout)
		}
	}
}
