export async function LoadPersistedJson() {
	const { ok, body } = await HttpClient.allPersistedJsonFiles({
		body: {},
		ok: body => {
			// 			for (let { name, content } of body) {
			// 				PersistedJson[name] = Assert.jsonObject(content)

			// 				Assert.notPresent(PersistedJson[name].save)

			// 				PersistedJson[name].save = () => {
			// 					return HttpClient.savePersistedJson({
			//						body: {
			// 							name: name,
			// 							content: PersistedJson[name],
			// 						}
			//					})
			// 				}
			// 			}
		},
	})

	if (ok) {
		return body
	}
	else {
		Toast(body)
		console.error(body)
	}
}