import childProcess from "child_process"
import { Files } from "#root/dev/build_tools/Files.js"
import { FileConfig } from "#root/FileConfig.js"
import path from "path"

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