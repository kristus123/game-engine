export const SessionId = Random.uuid()

export function Log(...args) {

	console.log(args)

	fetch(`${Config.httpUrl}/log`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ sessionId: SessionId, message: args.join(" ") })
	}).catch(() => {})
}
