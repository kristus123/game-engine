import { Files } from "#root/dev/build_tools/Files.js"
import { Methods } from "#root/server/http/Methods.js"

Methods.add("allPersistedJsonFiles", ({ body }) => {
	return Files.inFolder("persistedjson").map(path => ({
		name: path.split("/").pop().split(".")[0],
		content: JSON.parse(Files.read(path)),
	}))
})

Methods.add("getPersistedJson", ({ body }) => {
	return Files.read(`persistedjson/${body.name}.json`)
})

Methods.add("savePersistedJson", ({ body }) => {
	try {
		Files.write(`persistedjson/${body.name}.json`, JSON.stringify(body.content, null, 4))
	}
	catch (e) {
		throw new Error(e)
	}

	return {}
})
