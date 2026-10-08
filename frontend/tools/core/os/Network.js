export class Network {
	static online = false

	static get offline() {
		return !this.online
	}

	static {
		const check = () => {
			try {
				ChaosMonkey.maybeCrash(0.1, "network down")

				const body = await Assert.ok(await JsonHttpClient.ping())
				Assert.true(body.pong)
				Assert.true(SocketClient.connected)

				this.markOnline()
			}
			catch (e) {
				this.markOffline()
			}
		} 

		check()

		window.addEventListener("online", () => {
			check()
		})

		window.addEventListener("offline", () => {
			check()
		})

		setInterval(() => {
			check()
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

	static markOnline() {
		this.online = true

		if (this.online) {
			this._on.trigger({}) // maybe we should make it so that .trigger doesn't need any args
			this._change.trigger(this.online)
		}
	}

	static markOffline(pong) {
		this.online = false

		if (this.offline) {
			this._off.trigger({}) // maybe we should make it so that .trigger doesn't need any args
			this._change.trigger(this.online)
		}
	}

}
