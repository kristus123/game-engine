export class Log {
	static toServer(...args) {
		fetch(`${Config.httpUrl}/log`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ sessionId: "log_channel", message: args.join(" ") })
		}).catch(e => {
			console.error("failed to send log to discord server: " + e)
		})
	}

	static sendConsoleToServer() {
		for (const type of [
			"log",
			"warn",
			"error",
			"info",
			"debug",
			"trace",
			"dir",
			"table",
			"group",
			"groupCollapsed",
			"groupEnd",
			"assert",
		]) {
			const original = console[type]

			console[type] = (...args) => {
				original.apply(console, args)
				this.toServer(args)
			}
		}

		window.addEventListener("error", e => {
			console.log("ERROR:", e.message, e.filename, e.lineno, e.colno)
		})

		window.addEventListener("unhandledrejection", e => {
			console.log("UNHANDLED PROMISE:", e.reason)
		})

	}
}
