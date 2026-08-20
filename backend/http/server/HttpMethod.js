export class HttpMethod {

	static get = () => {
	}

	static post = async (req, res) => {
		// Poop.assertJsonBody(req)

		const encodedToken = req.headers["token"]

		const decodedToken = Poop.validToken(encodedToken)
			? ServerToken.decode(encodedToken)
			: null //todo not use null

		try {
			const body = await Poop.parseRawBody(req)

			const role = Role(decodedToken) // role expects null so it works - todo fix, null is bad
			const method = Router(role, Poop.routeName(req))

			const contentType = ContentType.assertSupported(req.headers["content-type"])

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


}
