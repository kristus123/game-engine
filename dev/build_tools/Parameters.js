export class Parameters {

	static extractParameters(parametersStr) {
		let parameters = parametersStr || ""
		if (parameters.includes("{")) {
			parameters = parameters.replaceAll("= {}", "")
			parameters = parameters.replaceAll("{", "")
			parameters = parameters.replaceAll("}", "")
		}

		parameters = parameters.split(",")
		parameters = parameters.map(p => p.split("=")[0].trim())
		parameters = parameters.filter(p => p.trim())

		return parameters
	}

	static inConstructor(content) {
		const match = content.match(/constructor\(([\s\S]*?)\)\s*\{/)

		if (match) {
			return Parameters.extractParameters(match[1])
		}
		else {
			return []
		}
	}

	static initVariablesFromConstructor(content) {
		return Parameters.inConstructor(content)
			.filter(p => !p.includes("...")) // in case they use ...args
			.map(p => `this.${p} = ${p}; \n`)
			.map(p => "\t\t" + p)
			.join()
			.replaceAll(",", "")
	}

	static nullCheckForConstructorArguments(content) {
		return Parameters.inConstructor(content)
			.map(p => `
				Assert.notNull(${p}, "argument ${p} in " + this.constructor.name + ".js should not be null")
			`).join("")
	}
}
