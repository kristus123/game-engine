import { Methods } from "#root/server/http/Methods.js"

Methods.add("test", ({ body }) => {
	return body
})
