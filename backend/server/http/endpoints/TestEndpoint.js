import { Methods } from "#root/backend/server/http/Methods.js"

Methods.add("test", ({ body }) => {
	return body
})
