import fs from "fs"
import path from "path"

import { Files } from "./Files.js"

export function UpdateEslint(allJsFiles = [
	...Files.at("frontend/"),
	...Files.at("backend/"),
	...Files.at("shared/"),
	...Files.at("dev/"),
]) {
	const eslintGlobalsConfig = {}

	allJsFiles.filter(f => f.endsWith(".js")).forEach(jsFile => {
		const className = path.basename(jsFile, ".js")
		eslintGlobalsConfig[className] = "readonly"
	})

	// Sort alphabetically
	const sortedEslintGlobalsConfig = Object.fromEntries(Object.entries(eslintGlobalsConfig).sort())

	const eslintRcPath = ".eslintrc.json"

	const eslintRcData = JSON.parse(fs.readFileSync(eslintRcPath, "utf8"))
	eslintRcData.globals = sortedEslintGlobalsConfig

	const updated = JSON.stringify(eslintRcData, null, 4)
	if (updated != fs.readFileSync(eslintRcPath, "utf8")) {
		fs.writeFileSync(eslintRcPath, updated)
	}
}


import { fileURLToPath } from "url"
if (process.argv[1] == fileURLToPath(import.meta.url)) {
	UpdateEslint()
}
