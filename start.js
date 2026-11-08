
import { GenerateImports } from "#root/dev/GenerateImports.js"
GenerateImports()


const { GenerateBackend } = await import("#root/AllImports.js")
GenerateBackend(process.argv[2]) // todo pass environment - "DEVELOPMENT" or "PRODUCTION"

// todo improve comment
// Needs to be imported like this because the transpiled folder is non existent before and it does not like that.
const { StartServer } = await import("#root/transpiledBackend/StartServer.js")

StartServer("PROD")
