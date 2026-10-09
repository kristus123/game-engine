import fs from "fs"
import path from "path"

export class Poop {

	static addCorsHeaders(res) {
		res.setHeader("Access-Control-Allow-Origin", "*")
		res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
		res.setHeader("Access-Control-Allow-Headers", "Content-Type, token")
		res.setHeader("Cross-Origin-Resource-Policy", "cross-origin")
	}

	static sendJson(res, httpStatus, data) {
		res.writeHead(httpStatus, {
			"Content-Type": "application/json"
		})

		res.end(JSON.stringify(data))
	}

	static sendEmptyBody(res, httpStatus) {
		res.statusCode = httpStatus
		res.end()
	}


	static validToken(encodedToken) {
		return encodedToken != null && encodedToken != "null"
	}

	static parseRawBody(req) {
		return new Promise((resolve, reject) => {
			const chunks = []

			req.on("data", chunk => {
				chunks.push(chunk)
			})

			req.on("end", () => {
				resolve(Buffer.concat(chunks))
			})

			req.on("error", reject)
		})
	}

	static async parseJsonBody(req) {
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
		catch (e) {
			const m = "Invalid JSON body: " + rawBody
			console.log(m)
			throw new Error(m)
		}
	}

	static routeName(req) {
		const pathname = new URL(req.url, `http://${req.headers.host}`).pathname
		const decodedPath = decodeURIComponent(pathname)
		const root = process.cwd()
		const filePath = path.resolve(root, "." + decodedPath)

		if (filePath != root && !filePath.startsWith(root + path.sep)) {
			throw new Error("Path traversal attempt")
		}
		else {
			return path.relative(root, filePath)
		}
	}

	static aPromise(value) {
		return value instanceof Promise
	}

	static validJson(value) { // no-null-check
		if (value == null) {
			return false
		}

		const type = Object.prototype.toString.call(value)

		return type == "[object Object]" || type == "[object Array]"
	}

	static getQueryParameters(req) {
		const url = new URL(req.url, `http://${req.headers.host}`)
		return Object.fromEntries(url.searchParams.entries())
	}

	static assertJsonBody(req) {
		const t = req.headers["content-type"] || ""

		if (!t.includes("application/json")) {
			throw new Error("unsupported content type")
		}
	}

	static streamFile(req, res, routeName) {
		fs.stat(routeName, (error, stats) => {
			if (error || !stats.isFile()) {
				res.writeHead(404)
				res.end()
				return
			}

			const headers = {
				"Accept-Ranges": "bytes",
				"Content-Type": ContentType.fromFile(routeName),
			}
			let statusCode = 200
			let streamOptions = {}
			const range = req.headers.range

			if (range != null) {
				const match = /^bytes=(\d*)-(\d*)$/.exec(range)
				if (match == null || (!match[1] && !match[2])) {
					res.writeHead(416, {
						"Content-Range": `bytes */${stats.size}`,
						"Accept-Ranges": "bytes",
					})
					res.end()
					return
				}

				let start
				let end
				if (match[1] == "") {
					const suffixLength = Number(match[2])
					start = Math.max(stats.size - suffixLength, 0)
					end = stats.size - 1
				}
				else {
					start = Number(match[1])
					end = match[2] == "" ? stats.size - 1 : Math.min(Number(match[2]), stats.size - 1)
				}

				if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start >= stats.size || start > end) {
					res.writeHead(416, {
						"Content-Range": `bytes */${stats.size}`,
						"Accept-Ranges": "bytes",
					})
					res.end()
					return
				}

				statusCode = 206
				streamOptions = { start, end }
				headers["Content-Range"] = `bytes ${start}-${end}/${stats.size}`
				headers["Content-Length"] = end - start + 1
			}
			else {
				headers["Content-Length"] = stats.size
			}

			res.writeHead(statusCode, headers)
			const stream = fs.createReadStream(routeName, streamOptions)
			stream.on("error", streamError => {
				console.error(streamError)
				res.destroy(streamError)
			})

			stream.pipe(res)
		})
	}

	// To do we should also make sure that one route can only be assigned to one you know,
	// like yeah, you can't assign two routes to two different permission routes,
	// if you know what I'm saying, bro.
	static route(req, role) {
		const path = Poop.routeName(req)

		console.log("calling: " + path)

		if (A.value(AdminRoute[path])) {
			Assert.either(role, ["ROLE_ADMIN"])
			return AdminRoute[path]
		}
		else if (A.value(UserRoute[path])) {
			Assert.either(role, ["ROLE_ADMIN", "ROLE_USER"])
			return UserRoute[path]
		}
		else if (A.value(UnsecureRoute[path])) {
			Assert.either(role, ["ROLE_ADMIN", "ROLE_USER", "ROLE_UNSECURE"])
			return UnsecureRoute[path] // accessible by everyone
		}
		else {
			console.log("is it registered correctly?")
			throw new Error("could not find where it is : " + path)
		}
	}

	static formatResponse(res, returnValue) { // no-null-check
		if (Poop.validJson(returnValue)) {
			Poop.sendJson(res, 200, returnValue)
		}
		else if (returnValue == null) {
			Poop.sendEmptyBody(res, 200)
		}
		else {
			throw new Error("we currently don't support any other return value.")
		}
	}


}
