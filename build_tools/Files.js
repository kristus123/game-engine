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

	static ContentMatchingIn(path, fileContent) {
		try {
			const distPath = Path.join('dist/static', Path.relative('static', path))
			const distFile = fs.readFileSync(distPath, 'utf8')

			return distFile == fileContent
		}
		catch (error) {
			return false
		}
	}
}
