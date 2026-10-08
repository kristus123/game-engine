export class Network {

	static online = false

	static _on = new Listener()
	static _off = new Listener()
	static _change = new Listener()

	static get offline() {
		return !this.online
	}

	static async httpCheck() {
		try {
			ChaosMonkey.maybeCrash("network down", 0.5)

			const body = await Assert.ok(await JsonHttpClient.ping())
			Assert.true(body.pong)
			return true
		}
		catch (e) {
			this.markOffline()
			return false
		}

	}

	static async check() { // todo better name
		try {
			ChaosMonkey.maybeCrash("network down", 0.5)

			Assert.true(this.httpEndpointCheck())
			// Assert.true(SocketClient.connected)

			this.markOnline()
			return true
		}
		catch (e) {
			this.markOffline()
			return false
		}
	}

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
		}, 5_00)
	}

	static onOnline(callback) {
		this._on.listen(callback)
	}

	static onOffline(callback) {
		this._off.listen(callback)
	}

	static onChange(callback) {
		this._change.listen(callback)
	}

	static markOnline() {
		if (this.offline) {
			console.log("online")
			this.online = true
			this._on.trigger({}) // maybe we should make it so that .trigger doesn't need any args
			this._change.trigger(true)
		}
	}

	static markOffline() {
		if (this.online) {
			console.log("offline")
			console.log(this._off)
			this._off.trigger({}) // maybe we should make it so that .trigger doesn't need any args
			this._change.trigger(false)
		}
	}

	static assertOnline() {
		Assert.true(this.online)
	}

}
