import Path from "path"

function containsExport(type, className, str) {
	const regex = new RegExp(`(export\\s+)?${type}\\s+${className}\\b`, "m")
	return regex.test(str)
}

export class Imports {

	static needed(content, jsFilePaths) {
		let imports = ""

		for (const jsFile of jsFilePaths) {
			const className = Path.basename(jsFile, ".js")

			if (Imports.include(content, className)) {
				if (jsFile.startsWith("frontend/")) {
					const browserPath = jsFile.startsWith("frontend/") ? jsFile.substring("frontend/".length) : jsFile
					imports += `import { ${className} } from '/${browserPath}'; \n`
				}
				else if (jsFile.startsWith("backend/")) {
					const serverPath = `#root/${jsFile}`.replace("backend/", "transpiledBackend/")
					imports += `import { ${className} } from '${serverPath}'; \n`
				}
				else {
					console.log(jsFile)
					throw new Error("salkdfjsalkdjf")
				}
			}
		}

		return imports
	}

	static include(content, className) {
		if (
			containsExport("class", className, content) ||
			containsExport("function", className, content) ||
			containsExport("const", className, content) ||
			containsExport("let", className, content)
		) {
			return false
		}
		else if (new RegExp(`\\b${className}\\b`).test(content)) {
			return true
		}
	}
}
