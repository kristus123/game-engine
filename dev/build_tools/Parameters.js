export default class Parameters {

	static inConstructor(content) {
		const match = content.match(/constructor\(([\s\S]*?)\)\s*\{/)

		if (match) {
			return match[1].split(",")
				.map(param => param.trim())
				.map(p => p.replaceAll(" ", ""))
				.map(p => p.split("=")[0])
				.filter(p => p != "")
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
    const constructorMatch = content.match(/constructor\(([\s\S]*?)\)\s*\{/)
    if (!constructorMatch) return ""

    const rawParams = constructorMatch[1]
        .split(",")
        .map(param => param.trim())
        .filter(p => p !== "")

    return rawParams
        .filter(p => !p.includes("="))  // skip optional params with defaults
        .map(p => p.replaceAll(" ", ""))
        .map(p => `
            Assert.notNull(${p}, "argument ${p} in " + this.constructor.name + ".js should not be null")
        `).join()
}
}
