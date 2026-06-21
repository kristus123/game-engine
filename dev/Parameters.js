function startsWith(line, list) {
	const cleaned = line.trimStart()

	return list.some(word =>
		cleaned.startsWith(word)
	)
}

export class Parameters {

	static initVariablesFromConstructor(content, params) {
		return params
			.map(p => `this.${p} = ${p}; \n`)
			.map(p => "\t\t" + p)
			.join()
			.replaceAll(",", "")
	}

	static extractIfPresent(line) {
		if (startsWith(line, ["document.", "this.", "//"])) {
			return null
		}

		const blacklist = new Set([
			"for",
			"for await",
			"if",
			"while",
			"switch",
			"catch",
			"filter",
			"Getter",
			"Enhance",
		])

		const regex =
			/(?:([a-zA-Z_$][\w$]*)\s*\(([\s\S]*)\)\s*\{|=\s*\(([\s\S]*)\)\s*=>\s*\{)/

		const match = line.match(regex)
		if (!match) {
			return null
		}

		const methodName = match[1] || null

		if (methodName && blacklist.has(methodName)) {
			return null
		}

		const parameters = (match[2] || match[3] || "")
			.replace(/"[^"]*"|'[^']*'|`[^`]*`/g, "") // remove text inside of strings
			.replaceAll("= {}", "")
			.replaceAll("{", "")
			.replaceAll("}", "")
			.split(",")
			.map(p => p.split("=")[0].trim())
			.filter(p => p.trim())
			.map(p => p.replace("...", ""))

		return {
			methodName: methodName,
			parameters: parameters
		}
	}
}
