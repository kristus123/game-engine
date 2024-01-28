const fs = require('fs')
const path = require('path')

const jsFiles = require('./get_js_files')

function createFileAndFolderStructure(destPath, content) {
	const folderPath = path.dirname(destPath)

	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(folderPath, { recursive: true })
	}

	fs.writeFileSync(destPath, content)
}


for (const srcPath of jsFiles) {
	let content = fs.readFileSync(srcPath, 'utf-8')
	const destPath = path.join('dist/static', path.relative('static', srcPath))

	let imports = ''
	for (const jsFilePath of jsFiles) {
		const className = path.basename(jsFilePath, '.js')
		const i = `import { ${className} } from '/${jsFilePath}'`

		if (content.includes(`export class ${className} {`)) {
			// Do nothing
		}
		else if (
			content.includes(`new ${className}`) ||
			content.includes(`${className}.`) ||
			content.includes(`${className}(`) ||
			content.includes(`instanceof ${className}`) ||
			content.includes(`extends ${className}`)
		) {
			imports += i + ';\n'
		}
	}

	content = imports + '\n' + content

	createFileAndFolderStructure(destPath, content)
}

require('./copy_asset_folder_to_dist')

const scriptImports = jsFiles.map(f => `<script type="module" src="/${f}"></script>`).join('\n')
const indexHtml = fs.readFileSync('templates/index.html', 'utf-8')
	.replace('SCRIPT_IMPORTS', scriptImports)
fs.writeFileSync('dist/index.html', indexHtml)
