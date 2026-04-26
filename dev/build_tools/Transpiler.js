function extractMethodParamsIfPresent(line) {
	const blacklist = new Set([
		"for",
		"if",
		"while",
		"switch",
		"catch",
		"filter",
		"Getter",
		"Enhance"
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

	let parameters = match[2] || match[3] || ""
	if (parameters.includes("{")) {
		parameters = parameters.replaceAll("= {}", "")
		parameters = parameters.replaceAll("{", "")
		parameters = parameters.replaceAll("}", "")
	}

	parameters = parameters.split(", ")
	parameters = parameters.map(p => p.split("=")[0].trim())
	parameters = parameters.filter(p => p.trim())

	return {
		methodName,
		parameters: parameters
	}
}

const ENVIRONMENT = process.argv[2] || false

if (!ENVIRONMENT) {
	throw new Error("you need to include ENVIRONMENT when calling generate_dist.js")
}

import path from "path"
import Imports from "#root/dev/build_tools/Imports.js"
import Parameters from "#root/dev/build_tools/Parameters.js"
import Files from "#root/dev/build_tools/Files.js"

import jsFiles from "#root/dev/build_tools/JsFiles.js"

import { FileConfig } from "#root/FileConfig.js"

for (const jsFilePath of jsFiles) {
	let fileContent = Files.read(jsFilePath)
	const className = path.parse(jsFilePath).name

	jsFiles.forEach(f => {
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

	let lines = fileContent.split("\n")

	for (let i = 0; i < lines.length; i++) {
		if (lines[i].includes("constructor(") && lines[i+1].includes("super(")) {
			lines[i+1] = lines[i+1] + "\n" + Parameters.nullCheckForConstructorArguments(fileContent)
			lines[i+1] = lines[i+1] + "\n" + Parameters.initVariablesFromConstructor(fileContent)
		}
		else if (lines[i].includes("constructor(")) {
			if (!fileContent.includes("export class SuperClass")) {
				lines[i] = lines[i] + "\n" + "super()"
			}
			lines[i] = lines[i] + "\n" + Parameters.nullCheckForConstructorArguments(fileContent)
			lines[i] = lines[i] + "\n" + Parameters.initVariablesFromConstructor(fileContent)
		}

		const methodParams = extractMethodParamsIfPresent(lines[i])
		if (methodParams && methodParams.parameters) {
			for (let ii = 0; ii < methodParams.parameters.length; ii++) {
				const p = methodParams.parameters[ii]
				console.log(p)
				lines[i] = lines[i] + "\n" + `Assert.notNull(${p}, 'parameter ${p} inside of ${className}.js can not be null')`
			}
		}
	}

	fileContent = lines.join("\n")

	fileContent = Imports.needed(fileContent, jsFiles) + "\n" + fileContent

	if (!jsFilePath.includes(`${FileConfig.client}`)) {
		throw new Error(`${jsFilePath} is not inside ${FileConfig.client}`)
	}

	Files.writeFileToDist(jsFilePath, fileContent)
}

