import path from 'path'


const ENVIRONMENT = process.argv[2] || false

if (!ENVIRONMENT) {
	throw new Error('you need to include ENVIRONMENT when calling generate_dist.js')
}


import Imports from './Imports.js'
import Parameters from './Parameters.js'
import Files from './Files.js'

import jsFiles from './js_files.js'

for (const jsFilePath of jsFiles) {

	let fileContent = Files.read(jsFilePath)

	jsFiles.forEach(f => {
		const className = path.parse(f).name
		if (Files.read(f).includes(`export class ${className}`)) {
			fileContent = fileContent.replaceAll(` ${className}(`, ` new ${className}(`)
		}
	})

	fileContent = fileContent.replaceAll('tla(', 'this.localObjects.add(')
	fileContent = fileContent.replaceAll('OnChange(', 'new OnChange(')
	fileContent = fileContent.replaceAll('OnTrue(', 'new OnTrue(')
	fileContent = fileContent.replaceAll('ENVIRONMENT', `"${ENVIRONMENT}"`)

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

