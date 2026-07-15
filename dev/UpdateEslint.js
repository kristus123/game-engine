import fs from "fs"
import path from "path"

import { Files } from "#root/dev/Files.js"

export function UpdateEslint() {
	const eslintGlobalsConfig = {}

	const allJsFiles = [ // todo improve this somehow. it will probably lead to bugs in the future
		...Files.at("frontend/"),
		...Files.at("backend/"),
		...Files.at("dev/"),
	].filter(f => f.endsWith(".js"))

	allJsFiles.forEach(jsFile => {
		const className = path.basename(jsFile, ".js")
		eslintGlobalsConfig[className] = "readonly"
	})

	// Sort alphabetically
	const sortedEslintGlobalsConfig = Object.fromEntries(Object.entries(eslintGlobalsConfig).sort())

	const eslintRcPath = ".eslintrc.json"

	const eslintRcData = JSON.parse(fs.readFileSync(eslintRcPath, "utf8"))
	eslintRcData.globals = sortedEslintGlobalsConfig

	fs.writeFileSync(eslintRcPath, JSON.stringify(eslintRcData, null, 4))
}


import { fileURLToPath } from "url"
if (process.argv[1] == fileURLToPath(import.meta.url)) {
	UpdateEslint()
}
