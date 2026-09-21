export class HttpMethod {

	static get = () => {
	}

	static post = async (req, res) => {
		console.log("swag")
		console.log(req.headers["token"])
		console.log("swag")

		const decodedToken = Poop.validToken(req.headers["token"])
			? ServerToken.decode(req.headers["token"])
			: null //todo - do not use null
		const role = Role(decodedToken) // role expects null so it works - todo fix, null is bad
		console.log("swag")

		const contentType = ContentType.parse(req.headers["content-type"])

		console.log("hei")
		let body = null

		if (contentType == null) {
			body = null
		}
		else if (contentType.name == ContentType.json) {
			body = await Poop.parseJsonBody(req)
		}
		else if (contentType.name == ContentType.webm) {
			// do nothing, let route handle it
		}
		else {
			throw new Error("unsupported contentType")
		}

		console.log("hei")

		try {
			const method = Router(role, Poop.routeName(req))
			const returnValue = await method({
				req: req,
				body: body,
				headers: req.headers,
				contentType: contentType,
				params: Poop.getQueryParameters(req),
			})

			if (Poop.validJson(returnValue)) {
				Poop.sendJson(res, 200, returnValue)
			}
			else if (returnValue == null) {
				Poop.sendEmptyBody(res, 200)
			}
			else {
				console.log(Poop.routeName(req))
				console.log(typeof returnValue)
				console.log(returnValue)
				throw new Error("we currently don't support any other return value.")
			}
		}
		catch (e) {
			console.log(e)
			Poop.sendJson(res, 500, {
				error: "error: " + e,
			})
		}
	}

}
