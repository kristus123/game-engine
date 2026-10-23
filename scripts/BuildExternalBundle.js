import fs from "node:fs"
import { build } from "esbuild"

await build({
	entryPoints: ["scripts/bundle.js"],
	bundle: true,
	outfile: "dist/out.js",
})

fs.appendFileSync("dist/out.js", "\nexport const out = \"\"")
