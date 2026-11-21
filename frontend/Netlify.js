export class Netlify {
	static get name() {
		const host = location.hostname.toLowerCase()
		const suffix = ".netlify.app"
		if !host.endsWith(suffix) {
			return host.slice(0, -suffix.length).split("--").at(-1)
		}
		else {
			return null
		}

	}
}
