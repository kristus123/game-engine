export default class Format {
	static json(data) {
		let jsonArray

		if (Array.isArray(data)) {
			jsonArray = data
		}
		else {
			jsonArray = [data]
		}

		const prettified = jsonArray.map(item => {
			const obj = JSON.parse(item)
			return JSON.stringify(obj, null, 2)
		})

		return '[\n' + prettified.join(',\n') + '\n]'
	}
}

