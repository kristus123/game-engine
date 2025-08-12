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

	static changeDetected(path, fileContent) {
		return !this.contentMatchingIn(path, fileContent)
	}

	static contentMatchingIn(path, fileContent) {
		try {
			const distPath = Path.join('dist/static', Path.relative('static', path))
			const distFile = fs.readFileSync(distPath, 'utf8')

			return distFile == fileContent
		}
		catch (error) {
			return false
		}
	}

	static getJsFiles(folderPath, jsFiles=[]) {
		try {
			for (const file of fs.readdirSync(folderPath)) {
				const filePath = Path.join(folderPath, file)

				if (fs.statSync(filePath).isDirectory()) {
					this.getJsFiles(filePath, jsFiles)
				}
				else if (file.endsWith('.js')) {
					jsFiles.push(filePath.replaceAll('\\', '/'))
				}
			}
			return jsFiles
		}
		catch (error) {
			return []
		}
	}

	static getUniqueElements(firstList, secondList) {
		const uniqueElements = []
		for (const o of firstList) {
			if (!secondList.includes(o)) {
				uniqueElements.push(o)
			}
		}

		return uniqueElements
	}

	static at(directory) {
		let results = []

		const entries = fs.readdirSync(directory)

		for (const entry of entries) {
			const fullPath = Path.join(directory, entry)
			const stat = fs.statSync(fullPath)

			if (stat.isDirectory()) {
				results = results.concat(this.at(fullPath))
			}
			else {
				results.push(fullPath)
			}
		}

		return results
	}



	static read(path) {
		return fs.readFileSync(path, 'utf-8')
	}

	static write(path, content) {
		fs.writeFileSync(path, content)
	}

}
