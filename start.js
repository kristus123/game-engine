import { AllImports } from "#root/AllImports.js"
const { GenerateBackend } = AllImports

GenerateBackend(process.argv[2]) // todo pass environment - "DEVELOPMENT" or "PRODUCTION"

// todo improve comment
// Needs to be imported like this because the transpiled folder is non existent before and it does not like that.
const { StartServer } = await import("#root/transpiledBackend/StartServer.js")

StartServer()

process.on("SIGTERM", () => {
	// nuke all for now. later clean up gently
	console.log("SIGTERM received. shutting down all stuff")
	process.exit(0)
})
