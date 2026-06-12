export class Internet {

	static connected = null

	static {
		this.check()

		window.addEventListener("online", () => {
			this.check()
		})

		window.addEventListener("offline", () => {
			this.check()
		})

		setInterval(() => {
			this.check()
		}, 500)
	}

	static _on = new Listener()
	static onOnline(callback) {
		console.log("online")
		this._on.listen(callback)
	}

	static _off = new Listener()
	static onOffline(callback) {
		console.log("offline")
		this._off.listen(callback)
	}

	static async check() {
		try {
			const body = await HttpClient.ping()
			Assert.true(body.pong)

			if (this.connected == null || this.connected == false) {
				this._on.trigger({}) // maybe we should make it so that .trigger doesn't need any args
				this.connected = true
			}
		}
		catch (e) {
			if (this.connected == null || this.connected == true) {
				this._off.trigger({}) // maybe we should make it so that .trigger doesn't need any args
				this.connected = false
			}
		}
	}
}
