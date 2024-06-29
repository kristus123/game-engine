class Format {

	static json(jsonData) {
	  if (Array.isArray(jsonData)) {
		// Parse and pretty-print each JSON string if the data is an array
			const prettifiedJsonArray = jsonData.map(jsonString => {
		  const jsonObject = JSON.parse(jsonString)
		  return JSON.stringify(jsonObject, null, 2)
			})

			// Join the prettified JSON strings into a single string with proper formatting
			const prettifiedJsonString = prettifiedJsonArray.join(',\n')

			// Wrap the joined string in array brackets to make it a valid JSON array
			return `[\n${prettifiedJsonString}\n]`
	  }
		else {
		// Parse and pretty-print the JSON string if the data is not an array
			const jsonObject = JSON.parse(jsonData)
			return JSON.stringify(jsonObject, null, 2)
	  }
	}
}

module.exports = Format
