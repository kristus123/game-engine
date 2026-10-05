const url = "test.happysun.no"

export class Config {

	// should This one should be renamed to something else like server URL or something at least, I'm not sure actually
	static get httpUrl() {
		// return "https://" + url

		if (Env.dev) {
			return "http://localhost:3000"
		}
		if (Env.prod) {
			return "https://krispetter.duckdns.org"
		}
		throw new Error("unexpected environment given")
	}

	static get wsUrl() {
		// return "wss://" + url

		if (Env.dev) {
			return "ws://localhost:3000"
		}
		if (Env.prod) {
			return "wss://krispetter.duckdns.org"
		}
		throw new Error("unexpected environment given")
	}

	static get mediasoupAnnounceIp() {
		// return url

		if (Env.dev) {
			return "127.0.0.1"
		}
		if (Env.prod) {
			return "krispetter.duckdns.org"
		}
		throw new Error("unexpected environment given")
	}
}
