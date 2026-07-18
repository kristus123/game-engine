import { AllImports } from "#root/AllImports.js"
const { GenerateBackend } = AllImports
GenerateBackend() // todo pass environment - "DEVELOPMENT"

// todo improve comment
// Needs to be imported like this because the transpiled folder is non existent before and it does not like that.
const { StartServer } = await import("#root/transpiledBackend/server/http/StartServer.js")
const { SocketServer } = await import("#root/transpiledBackend/server/socket/SocketServer.js")

StartServer()
