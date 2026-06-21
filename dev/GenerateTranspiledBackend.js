import { Files } from "#root/dev/Files.js"
import { Transpiler } from "#root/dev/Transpiler.js"

export function GenerateTranspiledBackend(ENVIRONMENT) {
	
	Transpiler(ENVIRONMENT, Files.at("backend"))
	
}
