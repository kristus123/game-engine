import { Methods } from "#root/backend/server/http/Methods.js"

Methods.add("ping", () => {
	return {
		pong: true,
	}
})
