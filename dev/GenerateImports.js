import { fileURLToPath } from "node:url"
import { Files } from "./Files.js"

export function GenerateImports() {
	let content = "// This is a generated file and it is gitignored\n"
	content += "import { LazyImport as CreateLazyImport } from \"#root/LazyImport.js\"\n"
	for (const name of Files.namesAndPaths("./").keys()) {
		content += `export const ${name} = CreateLazyImport(${JSON.stringify(name)})\n`
	}
	Files.write("AllImports.js", content)
}

if (process.argv[1] == fileURLToPath(import.meta.url)) {
	GenerateImports()
}
