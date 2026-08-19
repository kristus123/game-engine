export class Poop {

	static addCorsHeaders(res) {
		res.setHeader("Access-Control-Allow-Origin", "*")
		res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
		res.setHeader("Access-Control-Allow-Headers", "Content-Type, token")
	}

	static sendJson(res, httpStatus, data) {
		res.writeHead(httpStatus, {
			"Content-Type": "application/json"
		})

		res.end(JSON.stringify(data))
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

	static async parseBody(req) {
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
		return new URL(req.url, `http://${req.headers.host}`).pathname.slice(1)
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

	
}
