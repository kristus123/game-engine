UnsecureRoute.log = ({ body }) => {
	DiscordLogServer.sendMessage(body.sessionId, body.message)
	console.log("finished logging")
	return {}
}
