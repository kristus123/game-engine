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
let shuttingDown = false
let stopFileWatcher = () => {}
let externalBundleProcess = null
let rebuilding = false
let developmentStarted = false
let backendStopPromise = null

async function buildExternalBundle() {
	const bundleProcess = PrepareExternalBundle()
	externalBundleProcess = bundleProcess
	const result = await bundleProcess.awaitFinish()
	if (externalBundleProcess == bundleProcess) {
		externalBundleProcess = null
	}
	if (result.code != 0 || result.signal != null) {
		throw new Error(`External bundle generation failed: code=${result.code}, signal=${result.signal}`)
	}
}

let rebuildTimeout = null
const changedPaths = new Map()

function scheduleRebuild(path, changeType) {
	changedPaths.set(path, changeType)
	if (developmentStarted) {
		pauseBackendForBuild().catch(error => {
			if (!shuttingDown) {
				console.error("Failed to stop backend for rebuild", error)
			}
		})
	}
	clearTimeout(rebuildTimeout)

	rebuildTimeout = setTimeout(() => {
		rebuildTimeout = null
		processRebuilds()
	}, 100)
}

function pauseBackendForBuild() {
	if (!developmentStarted) {
		return Promise.resolve()
	}
	if (backendStopPromise != null) {
		return backendStopPromise
	}

	backendStopPromise = p.kill().catch(error => {
		backendStopPromise = null
		throw error
	})
	return backendStopPromise
}

async function processRebuilds() {
	if (rebuilding || shuttingDown || !developmentStarted) {
		return
	}

	rebuilding = true
	try {
		await pauseBackendForBuild()
		while (!shuttingDown) {
			if (changedPaths.size > 0) {
				const changes = [...changedPaths]
				changedPaths.clear()

				const changedAsepriteFiles = changes
					.filter(([file, type]) => file.endsWith(".aseprite") && type != "delete")
					.map(([file]) => file)

				await Promise.all(changedAsepriteFiles.map(file => ExportAseprite(file)))

				const frontendChanged = changes.some(([file]) => file.startsWith("frontend/") || file.startsWith("shared/"))
				const backendChanged = changes.some(([file]) => file.startsWith("backend/") || file.startsWith("shared/"))

				if (frontendChanged) {
					await Swoo.generateDist()
					await buildExternalBundle()
				}
				if (backendChanged) {
					GenerateBackend("DEVELOPMENT")
				}
				continue
			}

			await new Promise(resolve => setTimeout(resolve, 150))
			if (changedPaths.size > 0 || rebuildTimeout != null) {
				continue
			}

			break
		}

		if (shuttingDown) {
			return
		}

		backendId += 1
		p.args = ["transpiledBackend/StartServer.js", backendId]
		p.start()
		backendStopPromise = null
	}
	catch (error) {
		if (!shuttingDown) {
			console.error("Failed to regenerate application", error)
		}
	}
	finally {
		rebuilding = false
		if (!shuttingDown && changedPaths.size > 0 && rebuildTimeout == null) {
			rebuildTimeout = setTimeout(() => {
				rebuildTimeout = null
				processRebuilds()
			}, 100)
		}
	}
}

stopFileWatcher = FileWatcher([Paths.sharedFolder, Paths.frontendFolder, Paths.backendFolder], [".js", ".aseprite", ".html", ".css", ".md"], {
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

async function shutdown(signal) {
	if (shuttingDown) {
		return
	}
	shuttingDown = true
	console.log(`Shutting down development watcher (${signal})`)
	clearTimeout(rebuildTimeout)
	stopFileWatcher()

	const results = await Promise.allSettled([
		p.kill(),
		Swoo.stop(),
		ChildProcess.stopAll("aseprite"),
		externalBundleProcess?.kill(),
		ServeDist.stop(),
	])
	for (const result of results) {
		if (result.status == "rejected") {
			console.error("Error while shutting down development watcher", result.reason)
		}
	}

	process.exit(signal == "SIGINT" ? 130 : 0)
}

process.once("SIGINT", () => shutdown("SIGINT"))
process.once("SIGTERM", () => shutdown("SIGTERM"))
process.once("SIGHUP", () => shutdown("SIGHUP"))

async function startDevelopmentEnvironment() {
	try {
		while (true) {
			changedPaths.clear()
			await Swoo.generateDist()
			await ExportAseprite()
			await buildExternalBundle()
			GenerateBackend("DEVELOPMENT")

			await new Promise(resolve => setTimeout(resolve, 150))
			if (changedPaths.size == 0 && rebuildTimeout == null) {
				break
			}
		}
	}
	catch (error) {
		if (!shuttingDown) {
			console.error("Failed to build development output", error)
		}
		return
	}
	if (shuttingDown) {
		return
	}
	ServeDist()
	backendId += 1
	p.args = ["transpiledBackend/StartServer.js", backendId]
	p.start()
	backendStopPromise = null
	developmentStarted = true
}

startDevelopmentEnvironment()
