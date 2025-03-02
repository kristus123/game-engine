const Path = require('path')

class Imports {

	static needed(content, jsFilePaths) {
		let imports = ''

		for (const jsFile of jsFilePaths) {
			const className = Path.basename(jsFile, '.js')

			if (Imports.include(content, className)) {
				imports += `import { ${className} } from '/${jsFile}'; \n`
			}
		}

		return imports
	}

	static include(content, className) {
		if (
			content.includes(`export class ${className} {`) ||
			content.includes(`class ${className} {`) ||
			content.includes(`export function ${className}(`) ||
			content.includes(`export const ${className} =`)
		) {
			return false
		}
		else if (
			content.includes(`new ${className}`) ||
			content.includes(`${className}.`) ||
			content.includes(`${className}(`) ||
			content.includes(`instanceof ${className}`) ||
			content.includes(`extends ${className}`)
		) {
			return true
		}
	}
}

module.exports = Imports
