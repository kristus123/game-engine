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

let backendId = 0

const backendServerProcess = new ChildProcess(process.execPath, {
	args: ["transpiledBackend/StartServer.js", backendId],
	onExit: () => {
	},
})

FileWatcher([Paths.sharedFolder, Paths.frontendFolder, Paths.backendFolder], [".js", ".aseprite", ".html", ".css"], {
	onAdd: async (path) => {
		if (path.includes(".aseprite")) {
			await ExportAseprite(path)
		}

		Swoo.generateDist(() => {
			Swoo.triggerClientReload()
			backendServerProcess.restart()
		})
	},
	onChange: async (path) => {
		if (path.includes(".aseprite")) {
			await ExportAseprite(path)
		}

		Swoo.generateDist(() => {
			Swoo.triggerClientReload()
			backendServerProcess.restart()
		})
	},
	onDelete: async (path) => {
		Swoo.generateDist(() => {
			Swoo.triggerClientReload()
			backendServerProcess.restart()
		})
	},
})

// initial build
Swoo.generateDist(async () => {
	await ExportAseprite()
	PrepareExternalBundle()
	ServeDist()

	// for now only run server once
	backendServerProcess.start()
})
