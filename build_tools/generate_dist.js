const fs = require('fs')
const Path = require('path')
const Imports = require('./Imports')
const Parameters = require('./Parameters')

function writeFileToDist(srcPath, content) {
	const destPath = Path.join('dist/static', Path.relative('static', srcPath))

	const folderPath = Path.dirname(destPath)

	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(folderPath, { recursive: true })
	}

	fs.writeFileSync(destPath, content)
}

function countOccurrences(wordToCount, string) {
	let count = 0
	let index = wordToCount.indexOf(string)

	while (index !== -1) {
		count++
		index = wordToCount.indexOf(string, index + 1)
	}

	return count
}


let u = 0
function uuid() {
	u += 1
	return u
}

const jsFiles = require('./get_js_files')

for (const srcPath of jsFiles) {
	let content = fs.readFileSync(srcPath, 'utf-8')

	
	let steps = ''

	content = content.replaceAll('RunOnce(', 'RunOnce(this, TEMP_UUID, ')
	let count = countOccurrences(content, 'TEMP_UUID')
	for (let i = 0; i < count; i++) {
		content = content.replace('TEMP_UUID', uuid())
	}

	content = content.replaceAll('RunUntil(', 'RunUntil(this, TEMP_UUID_1, ')
	for (let i = 0; i < countOccurrences(content, 'TEMP_UUID_1'); i++) {
		content = content.replace('TEMP_UUID_1', uuid())
	}


	// todo bug if class does not have constructor?
	const match = content.includes("export class")

	if (match) {
		let lines = content.split('\n')

		for (let i = 0; i < lines.length; i++) {
			if (lines[i].includes('constructor(') && lines[i+1].includes('super(')) {
				lines[i+1] = lines[i+1] + '\n' + Parameters.nullCheckForConstructorArguments(content)
				lines[i+1] = lines[i+1] + '\n' + Parameters.initVariablesFromConstructor(content)
			}
			else if (lines[i].includes('constructor(')) {
				lines[i] = lines[i] + '\n' + Parameters.nullCheckForConstructorArguments(content)
				lines[i] = lines[i] + '\n' + Parameters.initVariablesFromConstructor(content)
			}
		}

		content = lines.join('\n')
	}

	content = Imports.needed(content, jsFiles) + '\n' + steps + '\n' + content

	writeFileToDist(srcPath, content)
}

require('./copy_asset_folder_to_dist')

const scriptImports = jsFiles.map(f => `<script type="module" src="/${f}"></script>`).join('\n')

const indexHtml = fs.readFileSync('templates/index.html', 'utf-8')
	.replace('SCRIPT_IMPORTS', scriptImports)

fs.writeFileSync('dist/index.html', indexHtml)
