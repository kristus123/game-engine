Route.allPersistedJsonFiles = ({ body, req }) => {
	return Files.inFolder("backend/persistedJson").map(path => ({
		name: path.split("/").pop().split(".")[0],
		content: JSON.parse(Files.read(path)),
	}))
}

Route.getPersistedJson = ({ body, req }) => {
	return Files.read(`backend/persistedJson/${body.name}.json`)
}

Route.savePersistedJson = ({ body }) => {
	try {
		Files.write(`backend/persistedJson/${body.name}.json`, JSON.stringify(body.content, null, 4))
	}
	catch (e) {
		throw new Error(e)
	}

	return {}
}