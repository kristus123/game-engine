import { Methods } from '#root/transpiledBackend/server/http/Methods.js'; 

Methods.add("test", ({ body }) => {
	return body
})
