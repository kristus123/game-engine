import Path from "path"

function containsExport(type, className, str) {
	const regex = new RegExp(`(export\\s+)?${type}\\s+${className}\\b`, "m")
	return regex.test(str)
}

function include(content, className) {
	// dont import lowercase files. this fixes index.js bug with EnhanceAll.js
	// todo improve solution later
	if (className[0] != className[0].toUpperCase()) {
		return false
	}

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

export class Imports {

	static needed(content, jsFilePaths, sourceFilePath) {
		let imports = ""

		for (const jsFile of jsFilePaths) {
			if (sourceFilePath && jsFile == sourceFilePath) {
				continue
			}

			const className = Path.basename(jsFile, ".js")

			if (include(content, className)) {
				const p = jsFile.replace("frontend/", "")
				imports += `import { ${className} } from '/${p}';`
				imports += "\n"
			}
		}

		return imports
	}
}
