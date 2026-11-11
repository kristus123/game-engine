export class Netlify {
	static get name() {
		const host = location.hostname.toLowerCase()
		const suffix = ".netlify.app"
		if !host.endsWith(suffix) {
			return null
		}

		const subdomain = host.slice(0, -suffix.length)
		return subdomain.split("--").at(-1)
	}
}
