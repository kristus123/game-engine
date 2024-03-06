function arraysAreEqual(arr1, arr2) {
	if (arr1.length !== arr2.length) {
		return false
	}

	for (let i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) {
			return false
		}
	}

	return true
}






class Parameters {

	static inConstructor(content) {
		const match = content.match(/export\s+class\s+\w+\s*{\s*constructor\s*\(([^)]*)\)/)

		if (match) {
			const parameters = match[1].split(',')
				.map(param => param.trim())
				.map(p => p.replaceAll(' ', ''))
				.map(p => p.split('=')[0])

			if (arraysAreEqual(parameters, [''])) {
				return []
			}
			else {
				return parameters
			}
		}
		else {
			return []
		}
	}

	static initVariablesFromConstructor(content) {
		console.log(Parameters.inConstructor(content))
		return Parameters.inConstructor(content)
			.map(p => `this.${p} = ${p}; \n`)
			.map(p => '\t\t' + p)
			.join()
			.replaceAll(',', '')
	}

	static nullCheckForConstructorArguments(content) {
		return Parameters.inConstructor(content)
			.map(p => `
				if (${p} === null) {
					throw new Error("${p} in " + this.constructor.name + " should not be null")
				}
			`)
			.join()
			.replaceAll(',', '')
	}
}

module.exports = Parameters
