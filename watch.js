import { Files } from "#root/dev/Files.js"

let allImports = "// This is a generated file and it is gitignored" + "\n"
allImports += "import { LazyImport as CreateLazyImport } from \"#root/LazyImport.js\"" + "\n"
for (const name of Files.namesAndPaths("./").keys()) {
	allImports += `export const ${name} = CreateLazyImport(${JSON.stringify(name)})` + "\n"
}
Files.write("AllImports.js", allImports)

const {
	Swoo,
	ChildProcess,
	Paths,
	GenerateBackend,
	PrepareExternalBundle,
	AssertNoReservedKeywordsUsedInFileNames,
	AssertUniqueFileNames,
	FileWatcher,
	ExportAseprite,
	ServeDist,
} = await import("#root/AllImports.js")


Swoo.killPorts()

AssertUniqueFileNames()
AssertNoReservedKeywordsUsedInFileNames()

Files.deleteFolder(Paths.distFolder)

let backendId = 0
const p = new ChildProcess(process.execPath)

async function restartBackend(regenerate = true) {
	if (regenerate) {
		GenerateBackend("DEVELOPMENT")
	}

	backendId += 1
	p.args = ["transpiledBackend/StartServer.js", backendId]
	p.restart()
}

let rebuildTimeout = null
const changedPaths = new Map()

function scheduleRebuild(path, changeType) {
	changedPaths.set(path, changeType)
	clearTimeout(rebuildTimeout)

	rebuildTimeout = setTimeout(async () => {
		const changes = [...changedPaths]
		changedPaths.clear()

		const changedAsepriteFiles = changes
			.filter(([file, type]) => file.endsWith(".aseprite") && type != "delete")
			.map(([file]) => file)

		try {
			await Promise.all(changedAsepriteFiles.map(file => ExportAseprite(file)))
		}
		catch (error) {
			console.error("Failed to export changed Aseprite files", error)
			return
		}

		const frontendChanged = changes.some(([file]) => file.startsWith("frontend/") || file.startsWith("shared/"))
		const backendChanged = changes.some(([file]) => file.startsWith("backend/") || file.startsWith("shared/"))
		if (frontendChanged) {
			Swoo.generateDist(() => {
				restartBackend(backendChanged)
			})
		}
		else {
			// Backend-only changes do not need a browser bundle rebuild.
			restartBackend()
		}
	}, 100)
}

FileWatcher([Paths.sharedFolder, Paths.frontendFolder, Paths.backendFolder], [".js", ".aseprite", ".html", ".css", ".md"], {
	onAdd: (path) => {
		scheduleRebuild(path, "add")
	},
	onChange: (path) => {
		scheduleRebuild(path, "change")
	},
	onDelete: (path) => {
		scheduleRebuild(path, "delete")
	},
})

Swoo.generateDist(async () => { // initial build
	await ExportAseprite()
	PrepareExternalBundle()
	ServeDist()
	setTimeout(restartBackend, 100)
})
