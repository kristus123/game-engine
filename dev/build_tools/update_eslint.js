import fs from 'fs'
import path from 'path'

import jsFiles from '#root/dev/build_tools/js_files.js'

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

fs.writeFileSync(eslintRcPath, JSON.stringify(eslintRcData, null, 4))
