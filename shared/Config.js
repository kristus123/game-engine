export class Config {

	// should This one should be renamed to something else like server URL or something at least, I'm not sure actually
	static get httpUrl() {
		switch (ENVIRONMENT) {
			case "DEVELOPMENT": {
				return "http://localhost:3000"
			}
			case "PRODUCTION": {
				throw new Error("rememer to change")
				// return "https://krispetter.duckdns.org"
				return "https://tanks-freeware-power-alone.trycloudflare.com"
			}
			default: {
				throw new Error("unexpected environment given")
			}
		}
	}

	static get wsUrl() {
		switch (ENVIRONMENT) {
			case "DEVELOPMENT": {
				return "ws://localhost:3000"
			}
			case "PRODUCTION": {
				return "wss://krispetter.duckdns.org"
			}
			default: {
				throw new Error("unexpected environment given")
			}
		}
	}

	static get mediasoupAnnounceIp() {
		switch (ENVIRONMENT) {
			case "DEVELOPMENT": {
				return "127.0.0.1"
			}
			case "PRODUCTION": {
				return "krispetter.duckdns.org"
			}
			default: {
				throw new Error("unexpected environment given")
			}
		}
	}
}
