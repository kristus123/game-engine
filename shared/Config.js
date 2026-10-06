const url = "test.happysun.no"
const cloudflared = true

export class Config {

	static get httpUrl() {
		if (cloudflared) {
			return "https://" + url
		}
		else if (Env.dev) {
			return "http://localhost:3000"
		}
		else if (Env.prod) {
			return "https://krispetter.duckdns.org"
		}
		throw new Error("unexpected environment given")
	}

	static get wsUrl() {
		if (cloudflared) {
			return "wss://" + url
		}
		else if (Env.dev) {
			return "ws://localhost:3000"
		}
		else if (Env.prod) {
			return "wss://krispetter.duckdns.org"
		}
		else {
			throw new Error("unexpected environment given")
		}
	}

	static get mediasoupAnnounceIp() {
		if (cloudflared) {
			return url
		}
		else if (Env.dev) {
			return "127.0.0.1"
		}
		else if (Env.prod) {
			return "krispetter.duckdns.org"
		}
		else {
			throw new Error("unexpected environment given")
		}
	}

	static get hlsTime() {
		return 2
	}

	static get hlsListSize() {
		return 3
	}
}
