import Path from 'path'

function containsExport(type, className, str) {
	const regex = new RegExp(`(export\\s+)?${type}\\s+${className}\\b`, 'm')
	return regex.test(str)
}

class Imports {

	static needed(content, jsFilePaths) {
		let imports = ''

		for (const jsFile of jsFilePaths) {
			const className = Path.basename(jsFile, '.js')

			if (Imports.include(content, className)) {
				const importPath = jsFile.replace(/^client[\/\\]/, '')
				imports += `import { ${className} } from '/${importPath}'; \n`
			}
		}

		return imports
	}

	static include(content, className) {
		if (
			containsExport('class', className, content) ||
			containsExport('function', className, content) ||
			containsExport('const', className, content) ||
			containsExport('let', className, content)
		) {
			return false
		}
		else if (new RegExp(`\\b${className}\\b`).test(content)) {
			return true
		}
	}
}

export default Imports
