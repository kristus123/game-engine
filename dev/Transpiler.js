import path from "path"

import { AllImports } from "#root/AllImports.js"
const { Imports, Parameters, Files, Paths, AddNullChecks, ImproveSwitchCase, ImproveIf } = AllImports

export function Transpiler(ENVIRONMENT, jsFiles) {
	if (!ENVIRONMENT) {
		throw new Error("you need to include environment when calling Transpiler.js")
	}

	const sharedFiles = Files.at(Paths.shared)

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

		if (!fileContent.includes("export class SuperClass")) {
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
			ImproveIf(lines, i)
		}

		fileContent = lines.join("\n")

		fileContent = Imports.needed(fileContent, [
			...jsFiles,
			...sharedFiles,
		]) + "\n" + fileContent

		fileContent = fileContent.replaceAll("ENVIRONMENT", `"${ENVIRONMENT}"`)

		Files.writeFileToDist(jsFilePath, fileContent)
	}

	for (let sharedFilePath of sharedFiles) {
		let content = Files.read(sharedFilePath)

		content = content.replaceAll("ENVIRONMENT", `"${ENVIRONMENT}"`)

		const imports = Imports.needed(content, [
			...sharedFiles,
			...jsFiles, // todo remove this. this is a hack
		])

		const p = "dist/" + sharedFilePath // todo improve
		const c = imports + "\n" + content
		Files.write(p, c)
	}

}
