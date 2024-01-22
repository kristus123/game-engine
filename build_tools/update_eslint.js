const fs = require('fs')
const path = require('path')

const jsFiles = require('./get_js_files')

const eslintGlobalsConfig = {}
jsFiles.forEach(jsFile => {
	const className = path.basename(jsFile, '.js')
	eslintGlobalsConfig[className] = 'readonly'
})

// Sort alphabetically
const sortedEslintGlobalsConfig = Object.fromEntries(Object.entries(eslintGlobalsConfig).sort())

const eslintRcPath = '.eslintrc.json'

const eslintRcData = JSON.parse(fs.readFileSync(eslintRcPath, 'utf8'))
eslintRcData.globals = sortedEslintGlobalsConfig

console.log(eslintRcData)

fs.writeFileSync(eslintRcPath, JSON.stringify(eslintRcData, null, 4))
