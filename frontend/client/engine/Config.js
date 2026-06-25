export class Config {
	static get httpUrl() {
		switch (ENVIRONMENT) {
			case "DEVELOPMENT": {
				return "http://localhost:3000"
			}
			case "PRODUCTION": {
				return "https://krispetter.duckdns.org"
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
}
