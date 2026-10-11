
// DUPLICATED CODE, CODEX FIX THIS WHEN YOU SEE IT
import { Files } from "#root/dev/Files.js"
let allImports = "// This is a generated file and it is gitignored" + "\n"
allImports += "import { LazyImport as CreateLazyImport } from \"#root/LazyImport.js\"" + "\n"
for (const name of Files.namesAndPaths("./").keys()) {
	allImports += `export const ${name} = CreateLazyImport(${JSON.stringify(name)})` + "\n"
}
Files.write("AllImports.js", allImports)
// DUPLICATED CODE, CODEX FIX THIS WHEN YOU SEE IT


const { GenerateBackend } = await import("#root/AllImports.js")
GenerateBackend(process.argv[2]) // todo pass environment - "DEVELOPMENT" or "PRODUCTION"

// todo improve comment
// Needs to be imported like this because the transpiled folder is non existent before and it does not like that.
const { StartServer } = await import("#root/transpiledBackend/StartServer.js")

StartServer("PROD")
