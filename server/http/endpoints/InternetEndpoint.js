import { Methods } from "#root/server/http/Methods.js"

Methods.add("ping", () => {
	return {
		pong: true,
	}
})
