const Path = require('path')


function contains(type, className, str) {
	const regex = new RegExp(`(export\\s+)?${type}\\s+${className}\\b`, 'm')
	return regex.test(str)
}

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
			contains('class', className, content) ||
			contains('function', className, content) ||
			contains('const', className, content)
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
