export class Parameters {

	static extractParameters(parametersStr) {
		return parametersStr
			.replaceAll("= {}", "")
			.replaceAll("{", "")
			.replaceAll("}", "")
			.split(",")
			.map(p => p.split("=")[0].trim())
			.filter(p => p.trim())
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
