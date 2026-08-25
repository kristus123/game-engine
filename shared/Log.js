export const SessionId = "log_channel"

function _sendToDiscord(args) {
	fetch(`${Config.httpUrl}/log`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ sessionId: SessionId, message: args.join(" ") })
	}).catch(() => {
		console.error("failed to send log to discord server")
	})
}

export function Log(...args) {
	console.log(args)
	_sendToDiscord(args)
}

Log.info = (...args) => {
	throw new Error("don't use Log.info(), just use Log()")
}

Log.warn = (...args) => {
	console.warn(args)
	_sendToDiscord(args)
}

Log.error = (...args) => {
	console.warn(args)
	_sendToDiscord(args)
}
