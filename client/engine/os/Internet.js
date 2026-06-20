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
		this._on.listen(callback)
	}

	static _off = new Listener()
	static onOffline(callback) {
		this._off.listen(callback)
	}

	static async check() {
		try {
			const body = await HttpClient.ping()
			Assert.true(body.pong)

			if (this.connected == null || this.connected == false) {
				console.log("online")
				this._on.trigger({}) // maybe we should make it so that .trigger doesn't need any args
				this.connected = true
			}
		}
		catch (e) {
			if (this.connected == null || this.connected == true) {
				console.log("offline")
				this._off.trigger({}) // maybe we should make it so that .trigger doesn't need any args
				this.connected = false
				throw new Error("Internet connection lost")
			}
		}
	}
}
