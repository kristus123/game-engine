const jsFiles = require('./js_files')

// better safe and strict than sorry and loosey goosey
const reservedJsKeywords = require('./reservedJsKeywords')
	.map(w => w.toLowerCase())

for (const file of jsFiles) {
	let name = file.split('/').pop().replace('.js', '')

	name = name.toLowerCase() // strict !

	if (reservedJsKeywords.includes(name)) {
		throw new Error(`${file} can not be named as such, because it clashes with a reserved js keywords`)
	}
}
