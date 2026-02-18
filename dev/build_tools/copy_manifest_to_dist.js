import fs from "fs"
import Path from "path"
import Files from "#root/dev/build_tools/Files.js"

import crypto from "crypto"


import { fileURLToPath } from "url"
import { dirname } from "path"
import FileConfig from "#root/FileConfig.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const mainFilename = process.argv[1]

fs.copyFileSync("manifest.json", FileConfig.toDistPath("manifest.json"))
fs.copyFileSync("sw.js", FileConfig.toDistPath("sw.js"))
fs.copyFileSync("sw-push.js", FileConfig.toDistPath("sw-push.js"))

const sw = Files.read("sw.js")
	.replace("RANDOM_UUID", "\"" + crypto.randomUUID() + "\"")
	.replace("ALL_FILES", "[" + Files.at(Path.dirname(mainFilename)).map(f => "\"/" + f + "\"").join(",") + "]")

Files.write(FileConfig.toDistPath("sw.js"), sw)
