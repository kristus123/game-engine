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

	const destDir = path.dirname(destBase)
	if (!fs.existsSync(destDir)) {
		fs.mkdirSync(destDir, { recursive: true })
	}

	console.log(`Exporting: ${srcFile} -> ${destBase}`)

	execFileSync('$HOME/aseprite/build/bin/aseprite', [
		'-b',
		srcFile,
		'--split-tags',
		'--list-slices',
		'--sheet',
		destBase + '.png',
		'--data',
		destBase + '.json',
		'--format',
		'json-array',
		'--filename-format',
		'{tag}',
	], { stdio: 'inherit', shell: true })


	execFileSync('$HOME/aseprite/build/bin/aseprite', [
		'-b',
		'--split-layers',
		srcFile,
		'--sheet',
		destBase + 'Layers.png',
		'--data',
		destBase + 'Layers.json',
		'--filename-format',
		'{layer}_{frame}_{tag}',
	], { shell: true })

	execFileSync('$HOME/aseprite/build/bin/aseprite', [
	  '-b',
	  srcFile,
	  '--script',
	  'aseprite_to_json.lua',
	  '--',
	  destBase + 'Tilemaps.json',
	], { shell: true })

	const file1 = `${destBase}.json`
	const file2 = `${destBase}Layers.json`
	const json1 = JSON.parse(fs.readFileSync(file1, 'utf8'))
	const json2 = JSON.parse(fs.readFileSync(file2, 'utf8'))

	const clean = obj => {
	  for (const key in obj) {
	    if (key === 'version') delete obj[key]
	    else if (typeof obj[key] === 'object') clean(obj[key])
	  }
	}

	clean(json1)
	clean(json2)

	fs.writeFileSync(file1, JSON.stringify(json1, null, 2))
	fs.writeFileSync(file2, JSON.stringify(json2, null, 2))
}



const editedFile = process.argv[2] || false
if (editedFile) {
	const destBase = getRelativeDestPath(editedFile)
	exportAseprite(editedFile, destBase)

}
else {
	walk(SRC_DIR, srcFile => {
		const destBase = getRelativeDestPath(srcFile)
		exportAseprite(srcFile, destBase)
	})
}
