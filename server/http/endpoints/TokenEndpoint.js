import { Methods } from "#root/server/http/Methods.js"
import { ServerToken } from "#root/server/ServerToken.js"

Methods.add("createToken", ({ body }) => {

	const token = ServerToken.create({
		internal: {},
		unsafe: {},
	})

	return {
		token: token
	}
})
