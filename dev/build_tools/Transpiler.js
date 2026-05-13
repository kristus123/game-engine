function simpleRegex(str, pattern) {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&")
		.replace(/\*/g, ".*");

  const regex = new RegExp("^" + escaped + "$");

  return regex.test(str)
}


function startsWith(line, list) {
  const cleaned = line.trimStart();

  return list.some(word =>
    cleaned.startsWith(word)
  );
}

function extractMethodParamsIfPresent(line) {
	if (startsWith(line, ["document.", "this.", "//"])) {
		return null
	}

	const blacklist = new Set([
		"for",
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
		methodName: methodName,
		parameters: parameters
	}
}

function indentations(str) {
	return (str.match(/\t/g) || []).length;
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
	const fileName = path.basename(jsFilePath)

	if (fileName == "out.js") {
		Files.writeFileToDist(jsFilePath, fileContent)
		continue
	}


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

	const lines = fileContent.split("\n")

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
		if (methodParams && methodParams.parameters && fileName != "Assert.js") {
			for (let ii = 0; ii < methodParams.parameters.length; ii++) {
				const p = methodParams.parameters[ii]
				lines[i] = lines[i] + "\n" + `Assert.notNull(${p}, 'parameter ${p} inside of ${className}.js can not be null')`
			}
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
	}

	fileContent = lines.join("\n")

	fileContent = Imports.needed(fileContent, jsFiles) + "\n" + fileContent

	if (!jsFilePath.includes(`${FileConfig.client}`)) {
		throw new Error(`${jsFilePath} is not inside ${FileConfig.client}`)
	}

	Files.writeFileToDist(jsFilePath, fileContent)
}
