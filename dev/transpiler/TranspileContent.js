import path from "path"
import { Files, Parameters, AddNullChecks, ImproveSwitchCase, ImproveIf } from "#root/AllImports.js"

export function TranspileContent(filePath, fileContent, jsFiles) {
	if (fileContent.includes("// disable-transpiling")) {
		return fileContent
	}

	const className = path.parse(filePath).name
	const fileName = path.basename(filePath)

	for (const f of jsFiles) {
		const candidateClassName = path.parse(f).name
		const fileText = Files.read(f)

		if (fileText.includes(`export class ${candidateClassName}`)) {
			// Only replace 'ClassName(' NOT preceded by 'new '
			const regex = new RegExp(`(?<!new )\\b${candidateClassName}\\(`, "g")
			fileContent = fileContent.replace(regex, `new ${candidateClassName}(`)
		}
	}

	if (!fileContent.includes("export class SuperClass")) {
		fileContent = fileContent.replaceAll(
			`export class ${className} {`, `export class ${className} extends SuperClass {`)
	}

	const lines = fileContent.split("\n")

	for (let i = 0; i < lines.length; i++) {
		if (lines[i].includes("constructor(")) {
			if (lines[i+1]?.includes("super(")) {
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

	return lines.join("\n")
}
