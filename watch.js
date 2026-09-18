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

AssertUniqueFileNames()
AssertNoReservedKeywordsUsedInFileNames()

Files.deleteFolder(Paths.distFolder)

let backendId = 0
const p = new ChildProcess(process.execPath)

function restartBackend() {
	GenerateBackend("DEVELOPMENT")

	backendId += 1
	p.args = ["transpiledBackend/StartServer.js", backendId]
	p.restart()
}

FileWatcher([Paths.sharedFolder, Paths.frontendFolder, Paths.backendFolder], [".js", ".aseprite", ".html", ".css", ".md"], {
	onAdd: async (path) => {
		if (path.includes(".aseprite")) {
			await ExportAseprite(path)
		}

		Swoo.generateDist(() => {
			restartBackend()
		})
	},
	onChange: async (path) => {
		if (path.includes(".aseprite")) {
			await ExportAseprite(path)
		}

		Swoo.generateDist(() => {
			restartBackend()
		})

	},
	onDelete: async (path) => {
		Swoo.generateDist(() => {
			restartBackend()
		})
	},
})

Swoo.generateDist(async () => { // initial build
	await ExportAseprite()
	PrepareExternalBundle()
	ServeDist()
	restartBackend()
})
