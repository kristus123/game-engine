UnsecureRoute.log = ({ jsonBody }) => {
    const { sessionId, message } = jsonBody
    if (!sessionId || typeof sessionId !== "string") {
        return { error: "No sessionId" }
    }
    
    DiscordLogServer.sendMessage(sessionId, message)
    return { status: "server success" }
}
