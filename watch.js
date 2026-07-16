import { Import } from "#root/Import.js"

import { execSync } from "child_process"

import { Files } from "#root/dev/Files.js"
import { FileConfig } from "#root/FileConfig.js"
import { GenerateBackend } from "#root/GenerateBackend.js"

import { PrepareExternalBundle } from "#root/dev/PrepareExternalBundle.js"
import { AssertNoReservedKeywordsUsedInFileNames } from "#root/dev/AssertNoReservedKeywordsUsedInFileNames.js"
import { AssertUniqueFileNames } from "#root/dev/AssertUniqueFileNames.js"

const TestWatcher = await Import("TestWatcher")

const ExportAseprite = await Import("ExportAseprite")
const ServeDist = await Import("ServeDist")

try {
	execSync("./kill_ports.sh", { stdio: "inherit" }) // todo make a windows version as well
}
catch (e) {
	console.log(e)
	console.log("failed to kill ports. most likely because this is a windows pc")
}

GenerateBackend("DEVELOPMENT")

AssertUniqueFileNames()
AssertNoReservedKeywordsUsedInFileNames()

Files.deleteFolder(FileConfig.dist)

// todo improve comment
// Needs to be imported like this because the transpiled folder is non existent before and it does not like that.
// also, we should use Import.js
const { StartServer } = await import("#root/transpiledBackend/server/http/StartServer.js")
const { SocketServer } = await import("#root/transpiledBackend/server/socket/SocketServer.js")






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

TestWatcher([FileConfig.shared, FileConfig.frontend, FileConfig.backend], [".js", ".aseprite", ".html", ".css"], {
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
