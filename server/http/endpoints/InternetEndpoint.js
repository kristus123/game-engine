import { Methods } from "#root/server/http/Methods.js"

Methods.add("internetPing", () => {
	return {
		connected: true,
	}
})
