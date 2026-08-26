import { execSync } from "child_process"
import { AllImports } from "#root/AllImports.js"

const {
	Files,
	Paths,
	GenerateBackend,
	PrepareExternalBundle,
	AssertNoReservedKeywordsUsedInFileNames,
	AssertUniqueFileNames,
	FileWatcher,
	ExportAseprite,
	ServeDist,
} = AllImports


try {
	execSync("./scripts/kill_ports.sh", { stdio: "inherit" }) // todo make a windows version as well
}
catch (e) {
	console.log(e)
	console.log("failed to kill ports. most likely because this is a windows pc")
}

GenerateBackend("DEVELOPMENT")

AssertUniqueFileNames()
AssertNoReservedKeywordsUsedInFileNames()

Files.deleteFolder(Paths.distFolder)

// todo improve comment
// Needs to be imported like this because the transpiled folder is non existent before and it does not like that.
// also, we should use Import.js
const { StartServer } = await import("#root/transpiledBackend/StartServer.js")
const { StopServer } = await import("#root/transpiledBackend/StopServer.js")
console.log("--------------------------------------------- wow")
const { SocketServer } = await import("#root/transpiledBackend/socket/SocketServer.js")






import { spawn } from "child_process"

let child
let runId = 0

export function _generateDist(onExit) {
	const currentId = ++runId

	if (child) {
		child.kill("SIGTERM")
		child = null
	}

	child = spawn(process.execPath, ["dev/GenerateFrontend.js", "DEVELOPMENT"], {
		stdio: "inherit"
	})

	child.on("exit", (code, signal) => {
		if (currentId != runId) {
			return
		}
		child = null
		if (code != 0) {
			return
		}
		onExit?.(code, signal)
		console.log("reload triggered")
	})
}












let idTimeout = null
function triggerClientReload() {
	if (idTimeout) {
		clearTimeout(idTimeout)
	}

	idTimeout = setTimeout(() => {
		SocketServer.sendToEveryone({ action: "HOT_RELOAD" })
		idTimeout = null
	}, 100)
}

function triggerServerReload() {
	StopServer()

	GenerateBackend("DEVELOPMENT")

	StartServer()
}

FileWatcher([Paths.sharedFolder, Paths.frontendFolder, Paths.backendFolder], [".js", ".aseprite", ".html", ".css"], {
	onAdd: async (path) => {
		if (path.includes(".aseprite")) {
			await ExportAseprite(path)
		}

		_generateDist(() => {
			triggerClientReload()
			triggerServerReload()
		})
	},
	onChange: async (path) => {
		if (path.includes(".aseprite")) {
			await ExportAseprite(path)
		}

		_generateDist(() => {
			triggerClientReload()
			triggerServerReload()
		})
	},
	onDelete: async (path) => {
		_generateDist(() => {
			triggerClientReload()
			triggerServerReload()
		})
	},
})

// initial build
_generateDist(async () => {
	await ExportAseprite()
	PrepareExternalBundle()
	ServeDist()

	// for now only run server once
	StartServer()
})
