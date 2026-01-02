import jsFiles from './js_files.js'
import Files from './Files.js'
import Path from 'path'

const pathFor = {}

for (const jsFilePath of jsFiles) {
	const className = Path.basename(jsFilePath, '.js')
	pathFor[className] = jsFilePath
}

Files.writeFileToDist('static/engine/generated/ModulePathFor.js',
	`
export const ModulePathFor = ${JSON.stringify(pathFor)}
`)
