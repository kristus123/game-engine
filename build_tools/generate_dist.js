<<<<<<< HEAD
||||||| parent of eb55a75 (x)
const fs = require('fs')
const path = require('path')
const Imports = require('./Imports')
const Parameters = require('./Parameters')
=======
const Imports = require('./Imports')
const Parameters = require('./Parameters')
>>>>>>> eb55a75 (x)
const Files = require('./Files')

<<<<<<< HEAD
require('./transpiler')
||||||| parent of eb55a75 (x)
const jsFiles = require('./get_js_files')

const distFiles = Files.getJsFiles('dist/static/').map(f => f.replace('dist/', ''))
const staticFiles = Files.getJsFiles('static/')

const filesToDeleteFromDist = Files.getUniqueElements(distFiles, staticFiles)
for (const f of filesToDeleteFromDist) {
	// Files.remove(f)
}


function getAllFilesSync(dirPath) {
	let results = []

	const entries = fs.readdirSync(dirPath)

	for (const entry of entries) {
		const fullPath = path.join(dirPath, entry)
		const stat = fs.statSync(fullPath)

		if (stat.isDirectory()) {
			results = results.concat(getAllFilesSync(fullPath))
		}
		else {
			results.push(fullPath)
		}
	}

	return results
}


for (const jsFilePath of jsFiles) {
	let fileContent = fs.readFileSync(jsFilePath, 'utf-8')

	fileContent = fileContent.replaceAll('tla(', 'this.localObjects.add(')

	fileContent = fileContent.replaceAll('OnChange(', 'new OnChange(')
	fileContent = fileContent.replaceAll('OnTrue(', 'new OnTrue(')

	if (fileContent.includes('export class')) {
		let lines = fileContent.split('\n')

		for (let i = 0; i < lines.length; i++) {
			if (lines[i].includes('constructor(') && lines[i+1].includes('super(')) {
				lines[i+1] = lines[i+1] + '\n' + Parameters.nullCheckForConstructorArguments(fileContent)
				lines[i+1] = lines[i+1] + '\n' + Parameters.initVariablesFromConstructor(fileContent)
				break
			}
			else if (lines[i].includes('constructor(')) {
				lines[i] = lines[i] + '\n' + Parameters.nullCheckForConstructorArguments(fileContent)
				lines[i] = lines[i] + '\n' + Parameters.initVariablesFromConstructor(fileContent)
				break
			}
		}

		fileContent = lines.join('\n')
	}

	fileContent = Imports.needed(fileContent, jsFiles) + '\n' + fileContent

	if (Files.changeDetected(jsFilePath, fileContent)) {
		Files.writeFileToDist(jsFilePath, fileContent)
	}
}


=======
const jsFiles = require('./get_js_files')


for (const jsFilePath of jsFiles) {
	let fileContent = Files.read(jsFilePath)

	fileContent = fileContent.replaceAll('tla(', 'this.localObjects.add(')

	fileContent = fileContent.replaceAll('OnChange(', 'new OnChange(')
	fileContent = fileContent.replaceAll('OnTrue(', 'new OnTrue(')

	if (fileContent.includes('export class')) {
		let lines = fileContent.split('\n')

		for (let i = 0; i < lines.length; i++) {
			if (lines[i].includes('constructor(') && lines[i+1].includes('super(')) {
				lines[i+1] = lines[i+1] + '\n' + Parameters.nullCheckForConstructorArguments(fileContent)
				lines[i+1] = lines[i+1] + '\n' + Parameters.initVariablesFromConstructor(fileContent)
				break
			}
			else if (lines[i].includes('constructor(')) {
				lines[i] = lines[i] + '\n' + Parameters.nullCheckForConstructorArguments(fileContent)
				lines[i] = lines[i] + '\n' + Parameters.initVariablesFromConstructor(fileContent)
				break
			}
		}

		fileContent = lines.join('\n')
	}

	fileContent = Imports.needed(fileContent, jsFiles) + '\n' + fileContent

	if (Files.changeDetected(jsFilePath, fileContent)) {
		Files.writeFileToDist(jsFilePath, fileContent)
	}
}


>>>>>>> eb55a75 (x)
require('./copy_asset_folder_to_dist')
require('./generate_helper_classes')


<<<<<<< HEAD
const allAsepritePaths = Files.at('static/assets/aseprite')
||||||| parent of eb55a75 (x)
const priority = ['Mouse.js', 'Camera.js']

const prioritized = priority.flatMap(key => jsFiles.filter(f => f.includes(key)))
const others = jsFiles.filter(f => !priority.some(key => f.includes(key)))

const orderedFiles = [...prioritized, ...others]

const scriptImports = orderedFiles
	.map(f => `<script type="module" src="${f}"></script>`)
	.join('\n')


function getAllFiles(dir) {
	const entries = fs.readdirSync(dir, { withFileTypes: true })

	let files = []

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name)
		if (entry.isDirectory()) {
			files = files.concat(getAllFiles(fullPath))
		}
		else {
			files.push(fullPath)
		}
	}

	return files
}

const cssImports = getAllFiles('static/ui/css')
	.map(f => f.replaceAll('\\', '/')) // for windows compability
	.map(f => `<link rel="stylesheet" href="/${f}">`)
	.join('\n')


const allAsepriteFiles = getAllFilesSync('static/assets/aseprite')
=======
const scriptImports = jsFiles
	.map(f => `<script type="module" src="${f}"></script>`)
	.join('\n')


const cssImports = Files.at('static/ui/css')
	.map(f => f.replaceAll('\\', '/')) // for windows compability
	.map(f => Files.read(f))
	.join('\n')


const allAsepritePaths = Files.at('static/assets/aseprite')
>>>>>>> eb55a75 (x)
	.map(f => f.replace('/aseprite', ''))
	.map(f => f.replace('\\aseprite', '')) // for windows compability (i assume)
	.map(f => f.replace('.aseprite', ''))
	.map(f => `/${f}`)
	.map(f => `"${f}"`)
	.map(f => f.replace(/\\/g, '/'))
Files.replace('dist/static/engine/index.js','ASEPRITE_FILES', `[${allAsepritePaths}]`)


<<<<<<< HEAD
const jsImports = require('./js_files')
	.map(f => `<script type="module" src="${f}"></script>`)
	.join('\n')
||||||| parent of eb55a75 (x)
const indexJs = fs.readFileSync('dist/static/engine/index.js', 'utf-8')
	.replaceAll('ASEPRITE_FILES', `[${allAsepriteFiles}]`)
fs.writeFileSync('dist/static/engine/index.js', indexJs)
=======
const indexJs = Files.read('dist/static/engine/index.js')
	.replaceAll('ASEPRITE_FILES', `[${allAsepritePaths}]`)
Files.write('dist/static/engine/index.js', indexJs)
>>>>>>> eb55a75 (x)

<<<<<<< HEAD
const cssImports = Files.at('static/ui/css')
	.map(f => f.replaceAll('\\', '/')) // for windows compability
	.map(f => Files.read(f))
	.join('\n')

const indexHtml = Files.read('static/index.html')
	.replace('SCRIPT_IMPORTS', jsImports)
||||||| parent of eb55a75 (x)
const indexHtml = fs.readFileSync('static/index.html', 'utf-8')
	.replace('SCRIPT_IMPORTS', scriptImports)
=======
const indexHtml = Files.read('static/index.html')
	.replace('SCRIPT_IMPORTS', scriptImports)
>>>>>>> eb55a75 (x)
	.replace('CSS_IMPORTS', cssImports)
Files.write('dist/index.html', indexHtml)
