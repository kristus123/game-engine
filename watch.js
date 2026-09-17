import { AllImports } from "#root/AllImports.js"

const {
	Swoo,
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

Swoo.killPorts()

GenerateBackend("DEVELOPMENT")

AssertUniqueFileNames()
AssertNoReservedKeywordsUsedInFileNames()

Files.deleteFolder(Paths.distFolder)

const { Server } = await import("#root/transpiledBackend/Server.js") // todo: find better solution
const { SocketServer } = await import("#root/transpiledBackend/socket/SocketServer.js") // todo: find better solution

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

		Swoo.generateDist(() => {
			triggerClientReload()
		})
	},
	onChange: async (path) => {
		if (path.includes(".aseprite")) {
			await ExportAseprite(path)
		}

		Swoo.generateDist(() => {
			triggerClientReload()
		})
	},
	onDelete: async (path) => {
		Swoo.generateDist(() => {
			triggerClientReload()
		})
	},
})

// initial build
Swoo.generateDist(async () => {
	await ExportAseprite()
	PrepareExternalBundle()
	ServeDist()

	// for now only run server once
	Server.start()
})
