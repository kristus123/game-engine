import Path from 'path'

import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const mainFilename = process.argv[1]

export default class {
	static writeFileToDist(srcPath, content) {
		const destPath = Path.join('dist', srcPath.replace(/^client[\/\\]/, ''))
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
			let relativePath = path.replace(/^client[\/\\]/, '')
			
			const distPath = Path.join('dist', relativePath)
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
					jsFiles.push(filePath.replaceAll('\\', Path.dirname(mainFilename)))
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

		return results.map(f => f.replaceAll('\\', '/'))
	}



	static read(path) {
		return fs.readFileSync(path, 'utf-8')
	}

	static write(path, content) {
		fs.writeFileSync(path, content)
	}

	static replace(path, x, y) {
		const content = this.read(path)
			.replaceAll(x, y)
		this.write(path, content)
	}

	static deleteFolder(folder) {
		console.log('deleting ' + folder)
		fs.rmSync(folder, { recursive: true, force: true })
	}


	static copyFolder(source, destination) {
		if (!fs.existsSync(source)) {
			console.error('Source folder does not exist.')
			process.exit(1)
		}

		if (!fs.existsSync(destination)) {
			fs.mkdirSync(destination)
		}

		const files = fs.readdirSync(source)

		files.forEach((file) => {
			const sourcePath = Path.join(source, file)
			const destinationPath = Path.join(destination, file)

			if (fs.statSync(sourcePath).isDirectory()) {
				this.copyFolder(sourcePath, destinationPath)
			}
			else {
				fs.copyFileSync(sourcePath, destinationPath)
			}
		})
	}

}
