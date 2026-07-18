import { AllImports } from "#root/AllImports.js"
const { Parameters } = AllImports

export function AddNullChecks(fileName, className, lines, i) {
	if (lines[i].includes("no-null-check")) {
		return [] // do nothing
	}

	const p = Parameters.extractIfPresent(lines[i])

	if (p && p.parameters && fileName != "Assert.js") {
		for (let ii = 0; ii < p.parameters.length; ii++) {
			const pp = p.parameters[ii]
			lines[i] = lines[i]
				+ "\n"
				+ "\t".repeat(3) // Just to make it slightly prettier
				+ `Assert.notNull(${pp}, 'param ${ii+1} - ${pp} - ${className}.${p.methodName}')`
		}

		return p.parameters
	}
	else {
		return []
	}
}
