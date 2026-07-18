import { createRequire } from "module"
import { Files } from "#root/dev/Files.js"
import Path from "path"

const require = createRequire(import.meta.url)

const fileMap = Object.fromEntries(
	Files.at("./").filter(f => f.endsWith(".js")).map(f => [Path.basename(f, ".js"), f])
)

export const AllImports = new Proxy({}, {
	get(target, prop) {
		if (typeof prop == "string") {
			if (!fileMap[prop]) {
    			throw new Error(`File ${prop}.js not found in project`)
			}
			else {
    			return require(Path.resolve(fileMap[prop]))[prop]
			}
		}
	}
})
