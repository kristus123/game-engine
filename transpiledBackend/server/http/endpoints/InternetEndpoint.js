import { Methods } from '#root/transpiledBackend/server/http/Methods.js'; 

Methods.add("ping", () => {
	return {
		pong: true,
	}
})
