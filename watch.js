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

async function restartBackend() {
	GenerateBackend("DEVELOPMENT")

	backendId += 1
	p.args = ["transpiledBackend/StartServer.js", backendId]
	p.restart()
}

let _debounceTimeout = null
function _debounce(fn) {
	clearTimeout(_debounceTimeout)

	_debounceTimeout = setTimeout(() => {
		fn()
	}, 200)
}

FileWatcher([Paths.sharedFolder, Paths.frontendFolder, Paths.backendFolder], [".js", ".aseprite", ".html", ".css", ".md"], {
	onAdd: async (path) => {
		if (path.includes(".aseprite")) {
			await ExportAseprite(path)
		}

		_debounce(() => {
			Swoo.generateDist(() => {
				restartBackend()
			})
		})
	},
	onChange: async (path) => {
		if (path.includes(".aseprite")) {
			await ExportAseprite(path)
		}

		_debounce(() => {
			Swoo.generateDist(() => {
				restartBackend()
			})
		})

	},
	onDelete: async (path) => {
		_debounce(() => {
			Swoo.generateDist(() => {
				restartBackend()
			})
		})
	},
})

Swoo.generateDist(async () => { // initial build
	await ExportAseprite()
	PrepareExternalBundle()
	ServeDist()
	_debounce(() => {
		restartBackend()
	})
})
