const Path = require('path')
const fs = require('fs')

module.exports = class {
	static writeFileToDist(srcPath, content) {
		const destPath = Path.join('dist/static', Path.relative('static', srcPath))

		const folderPath = Path.dirname(destPath)

		if (!fs.existsSync(folderPath)) {
			fs.mkdirSync(folderPath, { recursive: true })
		}

		fs.writeFileSync(destPath, content)
	}
}
