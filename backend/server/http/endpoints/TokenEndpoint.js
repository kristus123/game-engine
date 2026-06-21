import { Methods } from "#root/backend/server/http/Methods.js"
import { ServerToken } from "#root/backend/server/ServerToken.js"

Methods.add("createToken", ({ body }) => {

	const token = ServerToken.create()

	return {
		token: token,
	}
})
