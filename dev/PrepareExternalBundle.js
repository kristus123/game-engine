import childProcess from "child_process"
import path from "path"
import { AllImports } from "#root/AllImports.js"
const { Files, FileConfig } = AllImports

export function PrepareExternalBundle() {
	console.log("Building External Bundle...")

	childProcess.exec(`npx esbuild ${FileConfig.externalBundle} --bundle --outfile=${FileConfig.externalBundleDistPath}`, (err, stdout, stderr) => {
		if (err) {
			console.error(err)
		}
		else if (stderr) {
			console.log(stderr)
		}
		else if (stdout) {
			console.log(stdout)
		}

		Files.appendString(FileConfig.externalBundleDistPath, "\nexport const out = \"\"")
	})
}
