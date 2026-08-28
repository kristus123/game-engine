export class HttpMethod {

	static get = () => {
	}

	static post = async (req, res) => {

		const decodedToken = Poop.validToken(req.headers["token"])
			? ServerToken.decode(req.headers["token"])
			: null //todo - do not use null
		const role = Role(decodedToken) // role expects null so it works - todo fix, null is bad


		const contentType = ContentType.parse(req.headers["content-type"])
		let body = null

		console.log(contentType == null)
		if (contentType == null) {
			// keep body as null
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
			Log(e)
			Poop.sendJson(res, 500, {
				error: "error: " + e,
			})
		}
	}

}
