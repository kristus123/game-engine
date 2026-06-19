import path from "path"
import { Imports } from "#root/dev/build_tools/Imports.js"
import { Parameters } from "#root/dev/build_tools/Parameters.js"
import { Files } from "#root/dev/build_tools/Files.js"
import { JsFiles } from "#root/dev/build_tools/JsFiles.js"
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

export function Transpiler(ENVIRONMENT) {
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

			const methodParams = Parameters.extractIfPresent(lines[i])

			const applyNullChecks = (line = 0) => {
				if (methodParams && methodParams.parameters && fileName != "Assert.js") {
					for (let ii = 0; ii < methodParams.parameters.length; ii++) {
						const p = methodParams.parameters[ii]
						lines[line] = lines[line]
							+ "\n"
							+ `Assert.notNull(${p}, '${p} - ${className}.${methodParams.methodName}')`
					}

					return methodParams.parameters
				}
				else {
					return []
				}
			}

			if (lines[i].includes("constructor(") && lines[i+1].includes("super(")) {
				const params = applyNullChecks(i+1)
				lines[i+1] = lines[i+1] + "\n" + Parameters.initVariablesFromConstructor(fileContent, params)
			}
			else if (lines[i].includes("constructor(")) {
				if (!fileContent.includes("export class SuperClass")) {
					lines[i] = lines[i] + "\n" + "super()"
				}
				applyNullChecks(i)
				const params = applyNullChecks(i+1)
				lines[i] = lines[i] + "\n" + Parameters.initVariablesFromConstructor(fileContent, params)
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

			if (blockWithoutParentheses("if", lines[i])) {
				lines[i] = addParentheses("if", lines[i])
			}
		}

		fileContent = lines.join("\n")

		fileContent = Imports.needed(fileContent, JsFiles) + "\n" + fileContent

		if (!jsFilePath.includes(`${FileConfig.client}`)) {
			throw new Error(`${jsFilePath} is not inside ${FileConfig.client}`)
		}

		Files.writeFileToDist(jsFilePath, fileContent)
	}

}
