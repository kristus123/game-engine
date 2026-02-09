import jsFiles from './js_files.js'

// better safe and strict than sorry and loosey goosey
import reservedJsKeywords from './reservedJsKeywords.js'
const keywords = reservedJsKeywords
	.map(w => w.toLowerCase())

for (const file of jsFiles) {
	let name = file.split('/').pop().replace('.js', '')

	name = name.toLowerCase() // strict !

	if (keywords.includes(name)) {
		throw new Error(`${file} can not be named as such, because it clashes with a reserved js keywords`)
	}
}
