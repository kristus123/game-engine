export function StopServer() {
	HttpServer.stop()

	// TODO: Also close websocket server but I did not do it cuz it needs a somewhat redesign of LowLevelSocketServer (afaik) <--- from nabir
}
