import path from "path"
import { Files } from "#root/dev/Files.js"

export function AddSuperClass(className, fileContent, jsFiles) {
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

	return fileContent
}
