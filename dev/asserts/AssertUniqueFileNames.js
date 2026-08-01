import { AllImports } from "#root/AllImports.js"
const { Files, Paths } = AllImports

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

// consider a better more robust solution as this will probably be duplicated multiple places
const allFiles = [
	...Files.at(Paths.backend),
	...Files.at(Paths.frontend),
	...Files.at(Paths.shared),
].filter(f => !f.endsWith(".DS_Store")) // this is for macos users since mac makes this file for every folder opened.

function assertUnique(names, errorMessage) {
	const duplicates = extractDuplicates(names)
	if (duplicates.length > 0) {
		throw new Error(`${duplicates.join(", ")}: ${errorMessage}`)
	}
}

export function AssertUniqueFileNames() {
	// check JS files by base name (required by AllImports.js)
	const jsBaseNames = allFiles
		.filter(f => f.endsWith(".js"))
		.map(f => f.split("/").pop().replace(".js", ""))
	
	assertUnique(jsBaseNames, "we do not allow duplicate naming for .js files")

	// check all other files by their exact file names
	// maybe we change this in the future. it is a little strict
	// but currently this is what the engine expects
	const allNames = allFiles.map(f => f.split("/").pop())
	assertUnique(allNames, "we do not allow duplicate naming for any files")
}
