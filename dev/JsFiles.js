
import { Files } from "#root/dev/Files.js"
import { FileConfig } from "#root/FileConfig.js"

export const JsFiles = Files.at(FileConfig.frontend)
	.filter(f => f.endsWith(".js"))
	.map(f => f.replaceAll("\\", "/")) // is this one needed?
