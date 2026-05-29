export function LoadPersistedJson() {

	return HttpClient.allPersistedJsonFiles({}, body => {

		for (let { name, content } of body) {
			PersistedJson[name] = Assert.jsonObject(content)

			Assert.notPresent(PersistedJson[name].save)

			PersistedJson[name].save = () => {
				return HttpClient.savePersistedJson({
					name: name,
					content: PersistedJson[name],
				})
			}
		}

	})
}

