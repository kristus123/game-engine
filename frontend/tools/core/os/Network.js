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
			ChaosMonkey.maybeCrash({
				feature: "NETWORK_STATUS",
				message: "network down",
				chance: 0.5,
			})

			const body = await Assert.ok(await JsonHttpClient.ping())
			Assert.true(body.pong)
			this.markOnline()
		}
		catch (e) {
			this.markOffline()
			throw e
		}
	}

	static {
		window.addEventListener("online", () => {
			this.httpCheck()
		})

		window.addEventListener("offline", () => {
			this.httpCheck()
		})

		setInterval(() => {
			this.httpCheck()
		}, 5_000)
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
			this.online = false
			this._off.trigger({}) // maybe we should make it so that .trigger doesn't need any args
			this._change.trigger(false)
		}
	}

	static assertOnline() {
		Assert.true(this.online)
	}

}
