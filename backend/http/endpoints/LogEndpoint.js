UnsecureRoute.log = ({ json }) => {
	DiscordLogServer.sendMessage(jsonBody.sessionId, jsonBody.message)
	return {}
}
