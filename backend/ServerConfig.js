import { Secrets } from "#root/AllImports.js"

export class ServerConfig {
	static get shaSecret() {
		if (Env.dev) {
			return "CHANGE_ME"
		}
		else if (Env.prod) {
			return Assert.string(Secrets.shaSecret)
		}
		throw new Error("SHA secret is not configured for this environment")
	}
}
