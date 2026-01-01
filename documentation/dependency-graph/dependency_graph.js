const fs = require('fs')
const path = require('path')

const rootDir = process.cwd()
const excludeDirs = ['node_modules', '.git', 'dist', 'build']
const outputFile = path.join(rootDir, '/documentation/dependency-graph/class-usage.md')

// ✅ Delete old report if exists
if (fs.existsSync(outputFile)) {
	fs.unlinkSync(outputFile)
	console.log(`🗑️ Deleted old report: ${outputFile}`)
}

function walkDir(dir) {
	let results = []
	try {
		const files = fs.readdirSync(dir)
		for (const file of files) {
			if (excludeDirs.includes(file)) {
				continue
			}
			const fullPath = path.join(dir, file)
			const stat = fs.statSync(fullPath)
			if (stat.isDirectory()) {
				results = results.concat(walkDir(fullPath))
			}
			else if (file.endsWith('.js')) {
				results.push(fullPath)
			}
		}
	}
	catch {
		// Ignore errors
	}
	return results
}

function readFileContent(filePath) {
	try {
		return fs.readFileSync(filePath, 'utf-8')
	}
	catch {
		return ''
	}
}

function relativePath(file) {
	return path.relative(rootDir, file).replace(/\\/g, '/') // normalize for Windows
}

console.log(`📂 Scanning all .js files in ${rootDir} and subdirectories...\n`)

const allFiles = walkDir(rootDir)
const fileContents = new Map()

for (const file of allFiles) {
	fileContents.set(file, readFileContent(file))
}

const usageMap = new Map()

for (const classFile of allFiles) {
	const className = path.basename(classFile, '.js')
	const users = []

	for (const [file, content] of fileContents.entries()) {
		if (file === classFile) {
			continue
		}
		if (content.includes(className)) {
			users.push(relativePath(file))
		}
	}

	usageMap.set(className, {
		definedIn: relativePath(classFile),
		usedIn: users
	})
}

// ✅ Sort: Files with NO dependencies first
const sortedEntries = Array.from(usageMap.entries()).sort((a, b) => {
	const aNoUsage = a[1].usedIn.length === 0
	const bNoUsage = b[1].usedIn.length === 0

	if (aNoUsage && !bNoUsage) {
		return -1
	}
	if (!aNoUsage && bNoUsage) {
		return 1
	}

	// If both have usage or both don't, sort alphabetically by class name
	return a[0].localeCompare(b[0])
})

let mdOutput = `# Class Usage Report\n\nGenerated on: ${new Date().toLocaleString()}\n\n`

for (const [className, info] of sortedEntries) {
	mdOutput += `## ${className}\n\n`
	mdOutput += `**Defined in:** \`${info.definedIn}\`\n\n`
	if (info.usedIn.length > 0) {
		mdOutput += 'Used in:\n'
		for (const userFile of info.usedIn) {
			mdOutput += `- \`${userFile}\`\n`
		}
	}
	else {
		mdOutput += '_No usage found_\n'
	}
	mdOutput += '\n'
}

fs.writeFileSync(outputFile, mdOutput, 'utf-8')
console.log(`✅ New class usage report generated: ${outputFile}`)


for (const [className, info] of usageMap.entries()) {
	if (info.usedIn.length === 0) {
		const fileToDelete = path.join(rootDir, info.definedIn)
		try {
			// fs.unlinkSync(fileToDelete)
			// console.log(`🗑️ Deleted unused file: ${info.definedIn}`)
		}
		catch (err) {
			console.error(`❌ Failed to delete ${info.definedIn}:`, err.message)
		}
	}
}
