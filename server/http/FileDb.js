import fs from 'fs'
import path from 'path'

export class FileDb {
	static prefix = path.resolve('./fileDb')

	static ensureFolderExists(folderName) {
		if (!fs.existsSync(folderName)) {
			fs.mkdirSync(folderName, { recursive: true })
		}
	}

	static getFile(filePath) {
		FileDb.ensureFolderExists(FileDb.prefix)

		const fullPath = path.join(FileDb.prefix, filePath)
		if (!fs.existsSync(fullPath)) {
			return null
		}

		const content = fs.readFileSync(fullPath) // Buffer
		try {
			const str = content.toString('utf8')
			return JSON.parse(str)
		}
		catch {
			return content // Return Buffer if not JSON
		}
	}

	static getFilesInFolder(folderPath) {
		FileDb.ensureFolderExists(FileDb.prefix)
		
		try {
			const fullPath = path.join(FileDb.prefix, folderPath)
 			const files = fs.readdirSync(fullPath);
			const fileArray = []

  			console.log(`\nFiles in directory: ${folderPath}`);
  			files.forEach(filename => {
    			console.log(filename);
				const file = FileDb.getFile(path.join(folderPath, filename))
				fileArray.push(file)
  			});

			return fileArray
		} catch (err) {
  			console.error('Error reading directory synchronously:', err);
			return []
		}
	}

	static saveFile(filePath, data) {
		console.log("folder mode")
		console.log(filePath)
		const folderPath = filePath.split('/')
		folderPath.pop()
		console.log(folderPath)

		FileDb.ensureFolderExists(path.join(FileDb.prefix, ...folderPath))

		const fullPath = path.join(FileDb.prefix, filePath)
		const tempPath = fullPath + '.tmp'

		if (typeof data === 'object' && !(data instanceof Buffer)) {
			// JSON object
			fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8')
		}
		else {
			// Buffer or string (binary/text file)
			fs.writeFileSync(tempPath, data)
		}

		fs.renameSync(tempPath, fullPath)
	}

	static deleteFile(filePath) {
		FileDb.ensureFolderExists(FileDb.prefix)

		const fullPath = path.join(FileDb.prefix, filePath)
		if (fs.existsSync(fullPath)) {
			fs.unlinkSync(fullPath)
		}
	}

}

