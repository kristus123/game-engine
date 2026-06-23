import { ServerToken } from '#root/transpiledBackend/server/ServerToken.js'; 
import { Methods } from '#root/transpiledBackend/server/http/Methods.js'; 

Methods.add("createToken", ({ body }) => {

	const token = ServerToken.create()

	return {
		token: token,
	}
})
