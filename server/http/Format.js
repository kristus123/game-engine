export default class Format {

	static json(jsonData) {
	  if (Array.isArray(jsonData)) {
			const prettifiedJsonArray = jsonData.map(jsonString => {
		  const jsonObject = JSON.parse(jsonString)
		  return JSON.stringify(jsonObject, null, 2)
			})

			const prettifiedJsonString = prettifiedJsonArray.join(',\n')

			return `[\n${prettifiedJsonString}\n]`
	  }
		else {
			const jsonObject = JSON.parse(jsonData)
			return JSON.stringify(jsonObject, null, 2)
	  }
	}

}
