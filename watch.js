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

FileWatcher([Paths.sharedFolder, Paths.frontendFolder, Paths.backendFolder], [".js", ".aseprite", ".html", ".css"], {
	onAdd: async (path) => {
		if (path.includes(".aseprite")) {
			await ExportAseprite(path)
		}

		Swoo.generateDist(() => {
			Swoo.triggerClientReload()
		})
	},
	onChange: async (path) => {
		if (path.includes(".aseprite")) {
			await ExportAseprite(path)
		}

		Swoo.generateDist(() => {
			Swoo.triggerClientReload()
		})
	},
	onDelete: async (path) => {
		Swoo.generateDist(() => {
			Swoo.triggerClientReload()
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
