import Path from "path"

import fs from "fs"
import { Paths } from "#root/Paths.js"

const mainFilename = process.argv[1]

export class Files {
	static appendString(path, string) {
		const dir = Path.dirname(path)
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true })
		}

		fs.appendFileSync(path, string)
	}

	static writeFileToDist(srcPath, content) {
		const destPath = Paths.toDistPath(srcPath)
		const folderPath = Path.dirname(destPath)

		if (!fs.existsSync(folderPath)) {
			fs.mkdirSync(folderPath, { recursive: true })
		}

		fs.writeFileSync(destPath, content)
	}

	static inFolder(path) {
		return fs.readdirSync(path).map(f => Path.join(path, f))
	}

	static getJsFiles(folderPath) {
		const jsFiles = []

		for (const f of Files.at(folderPath)) {
			if (f.endsWith(".js")) {
				jsFiles.push(f)
			}
		}

		return jsFiles
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

	static at(directory, ignoredFolders = new Set(["node_modules", "dist", ".git"])) {
		let results = []

		for (const entry of fs.readdirSync(directory)) {
			if (ignoredFolders.has(entry)) {
				continue
			}

			const fullPath = Path.join(directory, entry)
			const stat = fs.statSync(fullPath)

			if (stat.isDirectory()) {
				results.push(...this.at(fullPath, ignoredFolders))
			}
			else {
				results.push(fullPath)
			}
		}

		return results.map(f => f.replaceAll("\\", "/"))
	}

	static find(filename) {
		const matches = Files.at("./").filter(file =>
			Path.basename(file) == filename
		)

		if (matches.length == 0) {
			throw new Error(`File not found: ${filename}`)
		}

		if (matches.length > 1) {
			throw new Error(
				`Duplicate files found for "${filename}":\n${matches.join("\n")}`
			)
		}

		return matches[0]
	}


	static read(path) {
		return fs.readFileSync(path, "utf-8")
	}

	static write(filePath, content) {
		const dir = Path.dirname(filePath)

		fs.mkdirSync(dir, { recursive: true })
		fs.writeFileSync(filePath, content)
	}

	// rename to replaceContent or replaceAll In order to make it clear that we are editing the file.
	// something at least should be improved
	static replace(path, x, y) {
		const content = this.read(path)
			.replaceAll(x, y)
		this.write(path, content)
	}

	static createFolder(path) {
		fs.mkdirSync(path, { recursive: true })
	}

	static deleteFolder(folder) {
		console.log("deleting " + folder)
		fs.rmSync(folder, { recursive: true, force: true })
	}

	static deleteFile(file) {
		console.log("deleting " + file)
		fs.unlinkSync(file)
	}

	static deleteFilesInFolder(folder) {
		for (const f of this.at(folder)) {
			this.deleteFile(f)
		}
	}

	static copyFile(source, destination) {
		const stat = fs.statSync(source)

		if (stat.isDirectory()) {
			throw new Error(`Expected file but got directory: ${source}`)
		}
		else {
			fs.copyFileSync(source, destination)
		}
	}

	static copyFolder(source, destination) {
		if (!fs.existsSync(source)) {
			console.error("Source folder does not exist.")
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
