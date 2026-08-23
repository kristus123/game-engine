UnsecureRoute.log = ({ jsonBody }) => {
    const { sessionId, message } = jsonBody
    if (!sessionId || typeof sessionId !== "string") {
        return { error: "No sessionId" }
    }

    const logLine = `[${new Date().toISOString()}] ${message}\n\n`
    Files.appendString(`logs/${sessionId}.txt`, logLine)
    
    DiscordGuild.logToSession(sessionId, message)
    return { status: "server success" }
}
