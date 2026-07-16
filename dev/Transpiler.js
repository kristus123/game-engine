import path from "path"

import { Imports } from "#root/dev/Imports.js"
import { Parameters } from "#root/dev/Parameters.js"
import { Files } from "#root/dev/Files.js"
import { AddNullChecks } from "#root/dev/transpiler/AddNullChecks.js"
import { ImproveSwitchCase } from "#root/dev/transpiler/ImproveSwitchCase.js"

export function Transpiler(ENVIRONMENT, jsFiles, importLookupFiles, writeFile) {
	if (!ENVIRONMENT) {
		throw new Error("Transpiler requires ENVIRONMENT")
	}

	const hasSuperClass = importLookupFiles.some(f => path.basename(f) == "SuperClass.js")

	for (const jsFilePath of jsFiles) {
		let fileContent = Files.read(jsFilePath)
		const className = path.parse(jsFilePath).name
		const fileName = path.basename(jsFilePath)

		for (const f of jsFiles) {
			const className = path.parse(f).name
			const fileText = Files.read(f)

			if (fileText.includes(`export class ${className}`)) {
				// Only replace 'ClassName(' NOT preceded by 'new '
				const regex = new RegExp(`(?<!new )\\b${className}\\(`, "g")
				fileContent = fileContent.replace(regex, `new ${className}(`)
			}
		}

		if (hasSuperClass && !fileContent.includes("export class SuperClass")) {
			fileContent = fileContent.replaceAll(
				`export class ${className} {`, `export class ${className} extends SuperClass {`)
		}

		const lines = fileContent.split("\n")

		for (let i = 0; i < lines.length; i++) {
			if (lines[i].includes("constructor(")) {
				if (lines[i+1].includes("super(")) {
					const params = AddNullChecks(fileName, className, lines, i+1)
					lines[i+1] = lines[i+1] + "\n" + Parameters.initVariablesFromConstructor(fileContent, params)
				}
				else {
					if (hasSuperClass && !fileContent.includes("export class SuperClass")) {
						lines[i] = lines[i] + "\n" + "super()"
					}
					const params = AddNullChecks(fileName, className, lines, i)
					lines[i] = lines[i] + "\n" + Parameters.initVariablesFromConstructor(fileContent, params)
				}
			}
			else {
				AddNullChecks(fileName, className, lines, i)
			}

			ImproveSwitchCase(lines, i)
		}

		fileContent = lines.join("\n")

		fileContent = Imports.needed(fileContent, importLookupFiles, jsFilePath) + "\n" + fileContent

		fileContent = fileContent.replaceAll("ENVIRONMENT", `"${ENVIRONMENT}"`)

		writeFile(jsFilePath, fileContent)
	}
}
