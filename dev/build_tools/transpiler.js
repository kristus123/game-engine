const ENVIRONMENT = process.argv[2] || false

if (!ENVIRONMENT) {
	throw new Error("you need to include ENVIRONMENT when calling generate_dist.js")
}

import path from "path"
import Imports from "#root/dev/build_tools/Imports.js"
import Parameters from "#root/dev/build_tools/Parameters.js"
import Files from "#root/dev/build_tools/Files.js"

import jsFiles from "#root/dev/build_tools/js_files.js"

import { FileConfig } from "#root/FileConfig.js"

for (const jsFilePath of jsFiles) {
	let fileContent = Files.read(jsFilePath)

	jsFiles.forEach(f => {
		const className = path.parse(f).name
		const fileText = Files.read(f)

		if (fileText.includes(`export class ${className}`)) {
			// Only replace className( NOT preceded by 'new '
			const regex = new RegExp(`(?<!new )\\b${className}\\(`, "g")
			fileContent = fileContent.replace(regex, `new ${className}(`)
		}
	})

	fileContent = fileContent.replaceAll("tla(", "this.localObjects.add(")
	fileContent = fileContent.replaceAll("ENVIRONMENT", `"${ENVIRONMENT}"`)

	if (fileContent.includes("export class")) {
		let lines = fileContent.split("\n")

		for (let i = 0; i < lines.length; i++) {
			if (lines[i].includes("constructor(") && lines[i+1].includes("super(")) {
				lines[i+1] = lines[i+1] + "\n" + Parameters.nullCheckForConstructorArguments(fileContent)
				lines[i+1] = lines[i+1] + "\n" + Parameters.initVariablesFromConstructor(fileContent)
				break
			}
			else if (lines[i].includes("constructor(")) {
				lines[i] = lines[i] + "\n" + Parameters.nullCheckForConstructorArguments(fileContent)
				lines[i] = lines[i] + "\n" + Parameters.initVariablesFromConstructor(fileContent)
				break
			}
		}

		fileContent = lines.join("\n")
	}

	fileContent = Imports.needed(fileContent, jsFiles) + "\n" + fileContent

	if (!jsFilePath.includes(`${FileConfig.client}`)) {
		throw new Error(`${jsFilePath} is not inside ${FileConfig.client}`)
	}

	Files.writeFileToDist(jsFilePath, fileContent)
}

