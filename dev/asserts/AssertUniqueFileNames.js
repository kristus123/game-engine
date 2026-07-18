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
const allJsFiles = [
	...Files.at(Paths.backend),
	...Files.at(Paths.frontend),
	...Files.at(Paths.shared),
].filter(f => f.endsWith(".js"))

export function AssertUniqueFileNames() {
	const processedNames = allJsFiles
		.map(f => f.split("/").pop().replace(".js", ""))

	const duplicates = extractDuplicates(processedNames)

	if (duplicates.length != 0) {
		throw new Error(`${duplicates}: we do not allow duplicate naming`)
		// maybe we change this in the future. it is a little strict
		// but currently this is what the engine expects
	}
}
