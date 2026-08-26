// kinda works, butnot completely

import esbuild from "esbuild"

await esbuild.build({
	entryPoints: ["index.js"],
	outfile: "bundle.js",

	bundle: true,
	platform: "browser",
	format: "esm",

	minify: true,
	treeShaking: true,

	target: "es2022",

	sourcemap: false,

	alias: {
		"#root": "./",
	},
	absWorkingDir: `${process.cwd()}/dist`,

	legalComments: "none",
})
