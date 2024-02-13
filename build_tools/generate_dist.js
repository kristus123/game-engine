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

function countOccurrences(inputString, substring) {
	let count = 0
	let index = inputString.indexOf(substring)

	while (index !== -1) {
		count++
		index = inputString.indexOf(substring, index + 1)
	}

	return count
}


let u = 0
function uuid() {
	u += 1
	return u
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



	content = content.replaceAll('RunOnce(', 'RunOnce(this, TEMP_UUID, ')

	let count = countOccurrences(content, 'TEMP_UUID')
	for (let i = 0; i < count; i++) {
		content = content.replace('TEMP_UUID', uuid())
	}


	const regex = /export\s+class\s+\w+\s*{\s*constructor\s*\(([^)]*)\)/
	const match = content.match(regex)

	if (match) {
		const parameters = match[1].split(',')
			.map(param => param.trim())
			.map(p => p.replaceAll(' ', ''))
			.map(p => p.split('=')[0])

		if (!(parameters.length == 1 && parameters[0] == '')) {

			const initVariables = parameters
				.map(p => `this.${p} = ${p}; \n`)
				.map(p => '\t\t' + p)
				.join()
				.replaceAll(',', '')
			const className = path.basename(srcPath, '.js')

			let lines = content.split('\n')
			for (let i = 0; i < lines.length; i++) {
				if (lines[i].includes('constructor') && !lines[i].includes('IGNORE')) {
					lines[i] = lines[i] + '\n' + initVariables
				}

				for (const p of parameters) {
					if (lines[i].replace(' ', '').includes(`this.${p}=`)) {
						console.log('Found shit in ' + className)
					}
				}
			}

			content = lines.join('\n')
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
