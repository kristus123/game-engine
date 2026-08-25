UnsecureRoute.log = ({ jsonBody }) => {
	DiscordLogServer.sendMessage(jsonBody.sessionId, jsonBody.message)
	return {}
}
