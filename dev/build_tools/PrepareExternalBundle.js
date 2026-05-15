import childProcess from 'child_process'
import Files from '#root/dev/build_tools/Files.js'
import { FileConfig } from '#root/FileConfig.js'
import path from 'path'

const inPath = path.join(import.meta.dirname, "../../" + FileConfig.externalBundle)
const outPath = path.join(import.meta.dirname, "../../" + FileConfig.dist + "/out.js")

console.log("Building External Bundle...")
childProcess.exec(`npx esbuild ${inPath} --bundle --outfile=${outPath}`, (err, stdout, stderr) => {
    if (err) {
        console.error(err)
    } else if (stderr) {
        console.log(stderr)
    } else if (stdout) {
        console.log(stdout)
    }

    Files.appendString(outPath, '\nexport const out = ""')
})