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

	// todo
	// We should sanitize so that they can't fetch other places. Also, we should add some sort of whitelist so that only certain stuff are allowed
	//
	static routeName(req) {
		const pathname = new URL(req.url, `http://${req.headers.host}`).pathname
		const decodedPath = decodeURIComponent(pathname)
		const root = process.cwd()
		const filePath = path.resolve(root, "." + decodedPath)

		if (filePath != root && !filePath.startsWith(root + path.sep)) {
			console.log(filePath)
			throw new Error("Path traversal attempt")
		}

		return path.relative(root, filePath)
	}

	static aPromise(value) {
		return value instanceof Promise
	}

	static validJson(value) {
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

	static streamFile(res, routeName) {
		res.writeHead(200, {
			"Content-Type": ContentType.fromFile(routeName)
		})

		const stream = fs.createReadStream(routeName)
		stream.on("error", error => {
			console.error(error)
			res.end()
		})

		stream.pipe(res)
	}

}
