import chokidar from "chokidar"

import { Import } from "#root/Import.js"
import { Files } from "#root/dev/Files.js"
import { FileConfig } from "#root/FileConfig.js"
import { execSync } from "child_process"
import { GenerateDist } from "#root/dev/GenerateDist.js"
import { GenerateBackend } from "#root/GenerateBackend.js"

GenerateBackend() // todo pass environment - "DEVELOPMENT"

// todo improve comment
// Needs to be imported like this because the transpiled folder is non existent before and it does not like that.
// also, we should use Import.js
const { StartServer } = await import("#root/transpiledBackend/server/http/StartServer.js")
const { SocketServer } = await import("#root/transpiledBackend/server/socket/SocketServer.js")

import { PrepareExternalBundle } from "#root/dev/PrepareExternalBundle.js"
import { AssertNoReservedKeywordsUsedInFileNames } from "#root/dev/AssertNoReservedKeywordsUsedInFileNames.js"
import { AssertUniqueFileNames } from "#root/dev/AssertUniqueFileNames.js"

const TestWatcher = await Import("TestWatcher")

const ExportAseprite = await Import("ExportAseprite")
const ServeDist = await Import("ServeDist")

AssertUniqueFileNames()
AssertNoReservedKeywordsUsedInFileNames()

Files.deleteFolder(FileConfig.dist)

let idTimeout = null
function triggerClientReload() {
	if (idTimeout) {
		clearTimeout(idTimeout)
	}

	idTimeout = setTimeout(() => {
		SocketServer.sendToEveryone({ action: "HOT_RELOAD" })
		idTimeout = null
	}, 50)
}


TestWatcher([FileConfig.client], [".js", ".aseprite"], {
	onAdd: (path) => {
		if (path.includes(".aseprite")) {
			ExportAseprite(path)
		}

		GenerateDist("DEVELOPMENT")
		triggerClientReload()

	},
	onChange: (path) => {
		if (path.includes(".aseprite")) {
			ExportAseprite(path)
		}

		GenerateDist("DEVELOPMENT")
		triggerClientReload()

	},
	onDelete: (path) => {
		Files.deleteFile(FileConfig.toDistPath(path))

		GenerateDist("DEVELOPMENT")
		triggerClientReload()
	},
})


// initial build
ExportAseprite()
GenerateDist("DEVELOPMENT")
PrepareExternalBundle()
ServeDist()

// for now only run server once
StartServer()
