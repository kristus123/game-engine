import path from "path"

import { Imports } from "#root/dev/Imports.js"
import { Parameters } from "#root/dev/Parameters.js"
import { Files } from "#root/dev/Files.js"
import { FileConfig } from "#root/FileConfig.js"

function blockWithoutParentheses(keyword, line) {
	const regex = new RegExp(
		`^\\s*${keyword}\\s+(?!\\()[^]*\\{$`
	)

	return regex.test(line)
}

function addParentheses(keyword, line) {
	const regex = new RegExp(`^(\\s*${keyword}\\s+)(?!\\()(.*?)(\\s*\\{\\s*)$`)

	return line.replace(regex, "$1($2)$3")
}

function simpleRegex(str, pattern) {

	const regexPattern = pattern
		.split("*")
		.map(s => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
		.join(".*")

	return new RegExp("^" + regexPattern).test(str.trim())
}

function indentations(str) {
	return (str.match(/\t/g) || []).length
}

export function Transpiler(ENVIRONMENT, JsFiles) {
	if (!ENVIRONMENT) {
		throw new Error("you need to include environment when calling generate_dist.js")
	}

	for (const jsFilePath of JsFiles) {
		let fileContent = Files.read(jsFilePath)
		const className = path.parse(jsFilePath).name
		const fileName = path.basename(jsFilePath)

		if (fileName == "out.js") {
			Files.writeFileToDist(jsFilePath, fileContent)
			continue
		}

		JsFiles.forEach(f => {
			const className = path.parse(f).name
			const fileText = Files.read(f)

			if (fileText.includes(`export class ${className}`)) {
				// Only replace 'ClassName(' NOT preceded by 'new '
				const regex = new RegExp(`(?<!new )\\b${className}\\(`, "g")
				fileContent = fileContent.replace(regex, `new ${className}(`)
			}
		})

		if (!fileContent.includes("export class SuperClass")) {
			fileContent = fileContent.replaceAll(
				`export class ${className} {`, `export class ${className} extends SuperClass {`)
		}

		fileContent = fileContent.replaceAll("ENVIRONMENT", `"${ENVIRONMENT}"`)

		const lines = fileContent.split("\n")

		for (let i = 0; i < lines.length; i++) {

			const p = Parameters.extractIfPresent(lines[i])

			const applyNullChecks = (line) => { // hacky
				if (p && p.parameters && fileName != "Assert.js") {
					for (let ii = 0; ii < p.parameters.length; ii++) {
						const pp = p.parameters[ii]
						lines[line] = lines[line]
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

			if (lines[i].includes("constructor(")) {
				if (lines[i+1].includes("super(")) {
					const params = applyNullChecks(i+1) // hacky
					lines[i+1] = lines[i+1] + "\n" + Parameters.initVariablesFromConstructor(fileContent, params)
				}
				else {
					if (!fileContent.includes("export class SuperClass")) {
						lines[i] = lines[i] + "\n" + "super()"
					}
					const params = applyNullChecks(i) // hacky
					lines[i] = lines[i] + "\n" + Parameters.initVariablesFromConstructor(fileContent, params)
				}
			}
			else {
				applyNullChecks(i)
			}

			if (simpleRegex(lines[i], "case *:") || simpleRegex(lines[i], "default:")) {
				const tabs = indentations(lines[i])

				for (let ii = 1 ; true ; ii++) {
					if (tabs == indentations(lines[i+ii])) {
						lines[i+ii] = "break // transpiler" + "\n" + lines[i+ii]
						break
					}
				}
			}

			if (blockWithoutParentheses("if", lines[i])) { // i am not sure if this works properly
				lines[i] = addParentheses("if", lines[i]) // i am not sure if this works properly
			}
		}

		fileContent = lines.join("\n")

		fileContent = Imports.needed(fileContent, JsFiles) + "\n" + fileContent

		// if (!jsFilePath.includes(`${FileConfig.client}`)) {
		// 	throw new Error(`${jsFilePath} is not inside ${FileConfig.client}`)
		// }

		if (jsFilePath.includes("frontend/")) {
			Files.writeFileToDist(jsFilePath, fileContent)
		}
		else if (jsFilePath.includes("backend/")) {
			Files.writeFileToTranspiledBackend(jsFilePath, fileContent)
		}
	}

}
