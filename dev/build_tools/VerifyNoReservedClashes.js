import jsFiles from "#root/dev/build_tools/JsFiles.js"

import reservedJsKeywords from "#root/dev/build_tools/ReservedJsKeywords.js"

// better safe and strict than sorry and loosey goosey
const keywords = reservedJsKeywords
	.map(w => w.toLowerCase())

for (const file of jsFiles) {
	const name = file.split("/").pop().replace(".js", "").toLowerCase() // ! Strict

	if (keywords.includes(name)) {
		throw new Error(`${file} can not be named as such, because it clashes with a reserved js keywords`)
	}
}
