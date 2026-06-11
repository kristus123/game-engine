export class Internet {

	static connected = false

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

	static on = new Listener()
	static onOnline(callback) {
		this.o.listen(callback)
	}

	static off = new Listener()
	static onOffline(callback) {
		this.off.listen(callback)
	}

	static check() {
		try {
			HttpClient.ping({}, body => {
				Assert.bool(body.pong)
				this.connected = body.pong

				if (!this.connected) {
					this.on.trigger()
				}
			})
		}
		catch (e) {
			
		}
	}
}
