UnsecureRoute.log = ({ body }) => {
	// DiscordLogServer.sendMessage(body.sessionId, body.message)

	Files.appendString("gitignored_folder/logs.txt", body.message)

	console.log("finished logging")
	return {}
}
