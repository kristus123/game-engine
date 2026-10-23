import { ChildProcess } from "#root/AllImports.js"

export function PrepareExternalBundle() {
	console.log("Building External Bundle...")

	return new ChildProcess(process.execPath, {
		args: ["scripts/BuildExternalBundle.js"],
		onExit: ({ code, signal }) => {
			if (code != 0 || signal != null) {
				console.error(`External bundle build failed: code=${code}, signal=${signal}`)
			}
		},
	}).start()
}
