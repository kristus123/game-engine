const productionHost = "krispetter.duckdns.org"

// cloudflared should ovveride all, but you can set it to false if you don't use it:
// const cloudflared = false // "test.happysun.no"
// cloudflared should be able to override Env
const cloudflared = false // "test.happysun.no"

export class Config {

	static get httpUrl() {
		if (cloudflared) {
			return "https://" + cloudflared
		}
		else if (Env.dev) {
			return "http://localhost:3000"
		}
		else if (Env.prod) {
			return "https://" + productionHost
		}
		throw new Error("unexpected environment given")
	}

	static get wsUrl() {
		if (cloudflared) {
			return "wss://" + cloudflared
		}
		else if (Env.dev) {
			return "ws://localhost:3000"
		}
		else if (Env.prod) {
			return "wss://" + productionHost
		}
		else {
			throw new Error("unexpected environment given")
		}
	}

	static get mediasoupAnnounceIp() {
		if (cloudflared) {
			return cloudflared
		}
		else if (Env.dev) {
			return "127.0.0.1"
		}
		else if (Env.prod) {
			return productionHost
		}
		else {
			throw new Error("unexpected environment given")
		}
	}

	static get hlsTime() {
		return 5
	}

	static get hlsListSize() {
		return 60
	}
}
