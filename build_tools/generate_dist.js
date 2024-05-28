const fs = require('fs')
const Imports = require('./Imports')
const Parameters = require('./Parameters')
const Files = require('./Files')

function countOccurrences(wordToCount, string) { // semantic error with parameter order
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

for (const jsFilePath of jsFiles) {
	let fileContent = fs.readFileSync(jsFilePath, 'utf-8')

	fileContent = fileContent.replaceAll('RunOnce(', 'RunOnce(this, TEMP_UUID, ')
	let count = countOccurrences(fileContent, 'TEMP_UUID')
	for (let i = 0; i < count; i++) {
		fileContent = fileContent.replace('TEMP_UUID', uuid())
	}

	fileContent = fileContent.replaceAll('RunUntil(', 'RunUntil(this, TEMP_UUID_1, ')
	for (let i = 0; i < countOccurrences(fileContent, 'TEMP_UUID_1'); i++) {
		fileContent = fileContent.replace('TEMP_UUID_1', uuid())
	}

	if (fileContent.includes('export class')) {
		let lines = fileContent.split('\n')

		for (let i = 0; i < lines.length; i++) {
			if (lines[i].includes('constructor(') && lines[i+1].includes('super(')) {
				lines[i+1] = lines[i+1] + '\n' + Parameters.nullCheckForConstructorArguments(fileContent)
				lines[i+1] = lines[i+1] + '\n' + Parameters.initVariablesFromConstructor(fileContent)
			}
			else if (lines[i].includes('constructor(')) {
				lines[i] = lines[i] + '\n' + Parameters.nullCheckForConstructorArguments(fileContent)
				lines[i] = lines[i] + '\n' + Parameters.initVariablesFromConstructor(fileContent)
			}
		}

		fileContent = lines.join('\n')
	}

	fileContent = Imports.needed(fileContent, jsFiles) + '\n' + fileContent

	Files.writeFileToDist(jsFilePath, fileContent)
}

require('./copy_asset_folder_to_dist')
require('./generate_helper_classes') 

const scriptImports = jsFiles
	.map(f => `<script type="module" src="/${f}"></script>`)
	.join('\n')

const overlay = fs.readFileSync('static/gui/overlay.html', 'utf-8')

const indexHtml = fs.readFileSync('static/index.html', 'utf-8')
	.replace('SCRIPT_IMPORTS', scriptImports)
	.replace('OVERLAY', overlay)

fs.writeFileSync('dist/index.html', indexHtml)

