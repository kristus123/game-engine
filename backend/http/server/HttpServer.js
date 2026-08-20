import http from "http"

export class HttpServer {

	static activeServer = null

	static start(port=3000, bind = "0.0.0.0") {
		if (this.activeServer) {
			throw new Error("HttpServer is already running")
		}
		else {
			console.log("starting server biotechnology")
			const server = http.createServer(async (req, res) => {
				Poop.addCorsHeaders(res)

				switch (req.method) {
					case "GET": {
						Poop.streamFile(res, Poop.routeName(req))
						break
					}
					case "POST": {
						HttpMethod.post(req, res)
						break
					}
					case "OPTIONS": { // Preflight / cors
						res.writeHead(204)
						res.end()
						break
					}
					default: {
						Poop.sendJson(res, 500, {
							error: "unsupported http method: " + req.method,
						})
						break
					}
				}
			})

			server.listen(port, bind)

			return server
		}
	}

	static stop() {
		if (this.activeServer) {
			this.activeServer.close()
			this.activeServer = null
		}
		else {
			throw new Error("HttpServer is not running")
		}
	}

}
