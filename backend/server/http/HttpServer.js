import http from "http"

function addCorsHeaders(res) {
	res.setHeader("Access-Control-Allow-Origin", "*")
	res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, token")
}

function sendJson(res, httpStatus, data) {
	res.writeHead(httpStatus, {
		"Content-Type": "application/json"
	})
	res.end(JSON.stringify(data))
}

export async function parseBody(req) {
	let rawBody = Buffer.alloc(0)

	for await (const chunk of req) {
		rawBody = Buffer.concat([rawBody, chunk])
	}

	if (rawBody.length == 0) {
		throw new Error("Invalid JSON body: " + rawBody)
	}

	try {
		return JSON.parse(rawBody.toString())
	}
	catch {
		const m = "Invalid JSON body: " + rawBody
		console.log(m)
		throw new Error(m)
	}
}

function routeName(req) {
	return new URL(req.url, `http://${req.headers.host}`).pathname.slice(1)
}

function validJson(value) {
	if (value == null) {
		return false
	}

	const type = Object.prototype.toString.call(value)

	return type == "[object Object]" || type == "[object Array]"
}

function getQueryParameters(req) {
	const url = new URL(req.url, `http://${req.headers.host}`)
	return Object.fromEntries(url.searchParams.entries())
}

function assertJsonBody(req) {
	const t = req.headers["content-type"] || ""

	if (!t.includes("application/json")) {
		throw new Error("unsupported content type")
	}
}

export class HttpServer {

	static activeServer = null

	static start() {
		if (this.activeServer) {
			throw new Error("HttpServer is already running")
		}

		this.activeServer = this.listen(3000)
		return this.activeServer
	}

	static stop() {
		if (!this.activeServer) {
			throw new Error("HttpServer is not running")
		}

		this.activeServer.close()
		this.activeServer = null
	}

	static listen(port, bind = "0.0.0.0") {
		const server = http.createServer(async (req, res) => {

			addCorsHeaders(res)

			if (req.method == "POST") {
				assertJsonBody(req)
				const encodedToken = req.headers["token"] || null
				const decodedToken = ServerToken.decode(encodedToken)
				const role = Role(decodedToken)

				try {
					const body = await parseBody(req)
					const method = Router(role, routeName(req))

					const json = method({
						body: body,
						req: req,
						headers: req.headers,
						contentType: req.headers["Content-Type"] || null,
						decodedToken: decodedToken,
						params: getQueryParameters(req),
					}) ?? {}

					if (validJson(json)) {
						sendJson(res, 200, json)
					}
					else {
						sendJson(res, 500, {
							error: "You must send valid json as a response.",
						})
					}
				}
				catch (e) {
					console.log(e)
					sendJson(res, 500, {
						error: e?.message || "shit went WHACK yo",
					})
				}
			}
			else if (req.method == "OPTIONS") { // Preflight / cors
				res.writeHead(204)
				res.end()
			}
			else {
				sendJson(res, 500, {
					error: "unsupported http method: " + req.method,
				})
			}
		})

		server.listen(port, bind)

		return server
	}

}
