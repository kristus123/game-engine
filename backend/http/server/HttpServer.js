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
					const _ = Sha.assertValid(TokenApi.decode(req.headers["token"]))

					case "GET": {
						try {
							const fileName = Poop.routeName(req) // todo make a Poop.fileName
							Assert.true(fileName.startsWith("public_folder/"))
							Poop.streamFile(res, fileName)
						}
						catch (e) {
							Poop.sendJson(res, 500, {
								error: "Failed to fetch file from GET endpoint:" + req.url,
							})
						}
						break
					}
					case "POST": {
						try {
							const decoded = Sha.assertValid(TokenApi.decode(req.headers["token"]))
							const role = decoded.internal.role

							const returnValue = (await Poop.route(req, role))({
								req: req,
								body: HttpBody(req),
								headers: req.headers,
								params: Poop.getQueryParameters(req),
							})

							return Poop.formatResponse(res, returnValue)
						}
						catch (e) {
							console.log(e)
							Poop.sendJson(res, 500, {
								error: "error: " + e,
							})
						}
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
