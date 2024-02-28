export class Imports {

	static includeImport(content, className) {
		if (content.includes(`export class ${className} {`) || content.includes(`export const ${className} =`)) {
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
