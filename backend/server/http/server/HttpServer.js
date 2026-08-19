import http from "http"

export class HttpServer {

	static activeServer = null

	static _listen(port, bind = "0.0.0.0") {
		const server = http.createServer(async (req, res) => {

			Poop.addCorsHeaders(res)

			if (req.method == "GET") { 
				const routeName = Poop.routeName(req)
				console.log(routeName)

				res.writeHead(200, {
					"Content-Type": ContentType.fromFile(routeName)
				})

				fs.createReadStream("./file.mp4").pipe(res)
			}
			else if (req.method == "POST") {
				Poop.assertJsonBody(req)

				const encodedToken = req.headers["token"]

				const decodedToken = Poop.validToken(encodedToken)
					? ServerToken.decode(encodedToken)
					: null //todo not use null

				try {
					const body = await Poop.parseRawBody(req)

					const role = Role(decodedToken) // role expects null so it works - todo fix, null is bad
					const method = Router(role, Poop.routeName(req))

					const contentType = ContentType.assertSupported(req.headers["Content-Type"])

					const returnValue = method({
						body: body, // fix
						req: req,
						headers: req.headers,
						contentType: contentType,
						params: Poop.getQueryParameters(req),
					}) ?? {}

					if (Poop.aPromise(returnValue)) { // Consider moving this promise check into the method method
						// currently no endpoints returns a promise, But i am just a comment and at one point I am wrong
						const x = await returnValue
						if (Poop.validJson(x)) {
							Poop.sendJson(res, 200, x)
						}
						else {
							throw new Error("return value of promise must be json, instead it is : " + x)
						}
					}
					else if (Poop.validJson(returnValue)) {
						Poop.sendJson(res, 200, returnValue)
					}
					else {
						Poop.sendJson(res, 500, {
							error: "endpoint must return a valuid value. it returned: " + returnValue,
						})
					}
				}
				catch (e) {
					console.log(e)
					Poop.sendJson(res, 500, {
						error: "error: " + e,
					})
				}
			}
			else if (req.method == "OPTIONS") { // Preflight / cors
				res.writeHead(204)
				res.end()
			}
			else {
				Poop.sendJson(res, 500, {
					error: "unsupported http method: " + req.method,
				})
			}
		})

		server.listen(port, bind)

		return server
	}

	static start() {
		if (this.activeServer) {
			throw new Error("HttpServer is already running")
		}
		else {
			this.activeServer = this._listen(3000)
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
