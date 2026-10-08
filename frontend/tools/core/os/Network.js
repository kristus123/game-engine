export class Network {

	static connected = false

	static {
		this.check()

		window.addEventListener("online", () => {
			this.check()
		})

		window.addEventListener("offline", () => {
			this.check()
		})

		setInterval(async () => {
			await this.check()
		}, 5_000)
	}

	static _on = new Listener()
	static onOnline(callback) {
		this._on.listen(callback)
	}

	static _off = new Listener()
	static onOffline(callback) {
		this._off.listen(callback)
	}

	static _change = new Listener()
	static onChange(callback) {
		this._change.listen(callback)
	}

	static async check() {
		try {
			const body = await Assert.ok(await JsonHttpClient.ping())
			Assert.true(body.pong)
			Assert.true(SocketClient.connected)

			this.markUp()
		}
		catch (e) {
			this.markDown()
		}
	}

	static markUp() {
		if (this.connected == false) {
			this.connected = true
			this._on.trigger({}) // maybe we should make it so that .trigger doesn't need any args
			this._change.trigger(this.connected)
		}
	}

	static markDown(pong) {
		if (this.connected == true) {
			this.connected = false
			this._off.trigger({}) // maybe we should make it so that .trigger doesn't need any args
			this._change.trigger(this.connected)
			throw new Error("internet connection lost")
		}
	}

}
