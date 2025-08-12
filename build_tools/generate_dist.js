const Imports = require('./Imports')
const Parameters = require('./Parameters')
const Files = require('./Files')

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


require('./copy_asset_folder_to_dist')
require('./generate_helper_classes')


const scriptImports = jsFiles
	.map(f => `<script type="module" src="${f}"></script>`)
	.join('\n')


const cssImports = Files.at('static/ui/css')
	.map(f => f.replaceAll('\\', '/')) // for windows compability
	.map(f => Files.read(f))
	.join('\n')


const allAsepritePaths = Files.at('static/assets/aseprite')
	.map(f => f.replace('/aseprite', ''))
	.map(f => f.replace('\\aseprite', '')) // for windows compability (i assume)
	.map(f => f.replace('.aseprite', ''))
	.map(f => `/${f}`)
	.map(f => `"${f}"`)
	.map(f => f.replace(/\\/g, '/'))


const indexJs = Files.read('dist/static/engine/index.js')
	.replaceAll('ASEPRITE_FILES', `[${allAsepritePaths}]`)
Files.write('dist/static/engine/index.js', indexJs)

const indexHtml = Files.read('static/index.html')
	.replace('SCRIPT_IMPORTS', scriptImports)
	.replace('CSS_IMPORTS', cssImports)
Files.write('dist/index.html', indexHtml)
