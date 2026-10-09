UnsecureRoute.ping = () => {
	return {
		pong: true,
		ready: HttpServer.ready,
	}
}
