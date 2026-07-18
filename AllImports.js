import { createRequire } from "module"
import { Files } from "#root/dev/Files.js"
import Path from "path"

const require = createRequire(import.meta.url)

let fileMap = null

export const AllImports = new Proxy({}, {
    get(target, prop) {
        if (typeof prop === "string") {
            if (!fileMap) {
                fileMap = {}
                Files.at("./").forEach(f => {
                    if (f.endsWith(".js")) {
                        fileMap[Path.basename(f, ".js")] = f
                    }
                })
            }
            
            const filePath = fileMap[prop]
            if (!filePath) throw new Error(`File ${prop}.js not found in project`)
            
            return require(Path.resolve(filePath))[prop]
        }
    }
})
