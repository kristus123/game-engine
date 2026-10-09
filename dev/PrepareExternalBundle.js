import { Files, Paths, ChildProcess } from "#root/AllImports.js"

export function PrepareExternalBundle() {
	console.log("Building External Bundle...")

	const esbuildPath = process.platform == "win32"
		? "node_modules/esbuild/bin/esbuild.exe"
		: "node_modules/esbuild/bin/esbuild"
	return new ChildProcess(esbuildPath, {
		args: [
			"scripts/bundle.js",
			"--bundle",
			`--outfile=${Paths.dist.externalBundle}`,
		],
		onExit: ({ code, signal }) => {
			if (code == 0 && signal == null) {
				Files.appendString(Paths.dist.externalBundle, "\nexport const out = \"\"")
			}
			else {
				console.error(`External bundle build failed: code=${code}, signal=${signal}`)
			}
		},
	}).start()
}
