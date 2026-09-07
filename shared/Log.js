export function Log(...args) {
	fetch(`${Config.httpUrl}/log`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ sessionId: "log_channel", message: args.join(" ") })
	}).catch(e => {
		console.error("failed to send log to discord server: " + e)
	})
}
