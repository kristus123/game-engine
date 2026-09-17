import { execSync } from "child_process"
import { AllImports } from "#root/AllImports.js"

const {
	ChildProcess,
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
const { SocketServer } = await import("#root/transpiledBackend/socket/SocketServer.js")

let p = null

export function _generateDist(onEnd) {
	p?.kill()

	p = new ChildProcess(process.execPath, {
		args: ["dev/GenerateFrontend.js", "DEVELOPMENT"],
		onExit: () => {
			onEnd()
		},
	}).start()
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

FileWatcher([Paths.sharedFolder, Paths.frontendFolder, Paths.backendFolder], [".js", ".aseprite", ".html", ".css"], {
	onAdd: async (path) => {
		if (path.includes(".aseprite")) {
			await ExportAseprite(path)
		}

		_generateDist(() => {
			triggerClientReload()
		})
	},
	onChange: async (path) => {
		if (path.includes(".aseprite")) {
			await ExportAseprite(path)
		}

		_generateDist(() => {
			triggerClientReload()
		})
	},
	onDelete: async (path) => {
		_generateDist(() => {
			triggerClientReload()
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
