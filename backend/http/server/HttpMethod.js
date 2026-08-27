export class HttpMethod {

	static get = () => {
	}

	static post = async (req, res) => {

		const decodedToken = Poop.validToken(req.headers["token"])
			? ServerToken.decode(req.headers["token"])
			: null //todo - do not use null
		const role = Role(decodedToken) // role expects null so it works - todo fix, null is bad

		try {
			const method = Router(role, Poop.routeName(req))
			const returnValue = await method({
				body: await Poop.parseRawBody(req),
				req: req,
				headers: req.headers,
				contentType: ContentType.parse(req.headers["content-type"]).name,
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
