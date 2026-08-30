import http from "http"

export class HttpServer {

	static activeServer = null

	static start() {
		if (this.activeServer) {
			throw new Error("HttpServer is already running")
		}
		else {
			const server = http.createServer(async (req, res) => {
				Poop.addCorsHeaders(res)

				switch (req.method) {
					case "GET": {
						try {
							const fileName = Poop.routeName(req) // fix routeName name
							Poop.streamFile(res, fileName)
						}
						catch (e) {
							Poop.sendJson(res, 500, {
								error: "Failed to fetch file from endpoint:" + req.url,
							})
						}
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

			server.listen(3000, "0.0.0.0")

			this.activeServer = server

			return this.activeServer
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
