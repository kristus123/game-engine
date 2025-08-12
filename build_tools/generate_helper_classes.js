const jsFiles = require('./js_files')
const Files = require('./Files')
const Path = require('path')

const pathFor = {}

for (const jsFilePath of jsFiles) {
	const className = Path.basename(jsFilePath, '.js')
	pathFor[className] = jsFilePath
}

Files.writeFileToDist('static/engine/generated/ModulePathFor.js',
	`
export const ModulePathFor = ${JSON.stringify(pathFor)}
`)
