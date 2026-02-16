import exportedNames from '#root/dev/build_tools/js_files.js'
const processedNames = exportedNames
	.map(f => f.split('/').pop().replace('.js', ''))

function extractDuplicates(arr) {
	const seen = new Set()
	const dupes = new Set()
	for (const e of arr) {
		if (seen.has(e)) {
			dupes.add(e)
		}
		else {
			seen.add(e)
		}
	}
	return [...dupes]
}

const duplicates = extractDuplicates(processedNames)

if (duplicates.length != 0) {
	throw new Error(`${duplicates}: we do not allow duplicate naming`)
	// maybe we change this in the future. it is a little strict
	// but currently this is what the engine expects
}
