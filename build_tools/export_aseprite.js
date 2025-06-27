const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const SRC_DIR = path.join(__dirname, '../static/assets/aseprite')
const DEST_BASE = path.join(__dirname, '../dist/static/assets')

function walk(dir, callback) {
	fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
		const fullPath = path.join(dir, entry.name)
		if (entry.isDirectory()) {
			walk(fullPath, callback)
		}
		else if (entry.isFile() && fullPath.endsWith('.aseprite')) {
			callback(fullPath)
		}
	})
}

function getRelativeDestPath(srcFile) {
	const relPath = path.relative(SRC_DIR, srcFile)
	const parsed = path.parse(relPath)
	const destFolder = path.join(DEST_BASE, parsed.dir.replace(/aseprite[\/\\]?/, ''))
	return path.join(destFolder, parsed.name)
}

function exportAseprite(srcFile, destBase) {
	const destImage = destBase + '.png'
	const destJson = destBase + '.json'
	const destDir = path.dirname(destBase)

	if (!fs.existsSync(destDir)) {
		fs.mkdirSync(destDir, { recursive: true })
	}

	console.log(`Exporting: ${srcFile} -> ${destImage} & ${destJson}`)

	execFileSync('aseprite', [
		'-b',
		srcFile,
		'--split-tags',
		'--sheet',
		destImage,
		'--data',
		destJson,
		'--format',
		'json-array',
		'--filename-format',
		'{tag}',
	], { stdio: 'inherit' })
}

walk(SRC_DIR, srcFile => {
	const destBase = getRelativeDestPath(srcFile)
	exportAseprite(srcFile, destBase)
})

