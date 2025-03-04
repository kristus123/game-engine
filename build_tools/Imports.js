const Path = require('path')


function contains(type, className, str) {
    const exportType = new RegExp(`\\bexport\\s+${type}\\s+${className}\\b`).test(str)
    const normalType = new RegExp(`\\b${type}\\s+${className}\\b`).test(str)

	return exportType || normalType
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
			(`extends ${className}`)
		) {
			return true
		}
	}
}

module.exports = Imports
