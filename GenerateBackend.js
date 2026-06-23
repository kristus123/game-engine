import { Files } from "#root/dev/Files.js"
import { Imports } from "#root/dev/Imports.js"

Files.deleteFolder("transpiledBackend")


for (let f of Files.at("backend/")) {
	console.log(f)

	const content = Files.read(f)

	
	const imports = Imports.needed(content, Files.at("backend/")).replaceAll("/backend/", "#root/backend/")

	Files.write(f.replace("backend/", "transpiledBackend/" ), imports + "\n" + content)
}
