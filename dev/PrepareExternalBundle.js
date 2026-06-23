
import childProcess from "child_process"
import { Files } from "#root/dev/Files.js"
import { FileConfig } from "#root/FileConfig.js"
import path from "path"

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