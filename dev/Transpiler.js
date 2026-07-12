import path from "path"

import { Imports } from "#root/dev/Imports.js"
import { Parameters } from "#root/dev/Parameters.js"
import { Files } from "#root/dev/Files.js"
import { FileConfig } from "#root/FileConfig.js"
import { AddNullChecks } from "#root/dev/transpiler/AddNullChecks.js"
import { ImproveSwitchCase } from "#root/dev/transpiler/ImproveSwitchCase.js"
import { AddSuperClass } from "#root/dev/transpiler/AddSuperClass.js"

export function Transpiler(ENVIRONMENT, jsFiles) {
	if (!ENVIRONMENT) {
		throw new Error("you need to include environment when calling generate_dist.js")
	}

	const sharedFiles = Files.at(FileConfig.shared)
	jsFiles = [...jsFiles, ...sharedFiles]

	for (const jsFilePath of jsFiles) {

		const className = path.parse(jsFilePath).name
		const fileName = path.basename(jsFilePath)

		let fileContent = Files.read(jsFilePath)
		fileContent = AddSuperClass(className, fileContent, jsFiles)
		const lines = fileContent.split("\n")

		for (let i = 0; i < lines.length; i++) {
			if (lines[i].includes("constructor(") && fileContent.includes("extends SuperClass")) {
				if (lines[i+1].includes("super(")) {
					const params = AddNullChecks(fileName, className, lines, i+1)
					lines[i+1] = lines[i+1] + "\n" + Parameters.initVariablesFromConstructor(fileContent, params)
				}
				else {
					if (!fileContent.includes("export class SuperClass")) {
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

		const neededImports = Imports.needed(fileContent, jsFiles)

		fileContent = neededImports + "\n" + fileContent

		fileContent = fileContent.replaceAll("ENVIRONMENT", `"${ENVIRONMENT}"`)

		Files.writeFileToDist(jsFilePath, fileContent)
	}
}
