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

const killPort = (port) => {
	try {
		if (process.platform == "win32") {
			const result = execSync(`netstat -aon | findstr :${port}`, { encoding: "utf8" })
			const pids = [...new Set(
  			result.split("\n")
					.map(line => line.trim().split(/\s+/).pop())
					.filter(pid => pid && /^\d+$/.test(pid) && pid != "0")
			)]
			pids.forEach(pid => execSync(`taskkill /f /pid ${pid}`))
  		}
		else {
			execSync(`fuser -k ${port}/tcp`)
		}

		console.log(`Killed process on port ${port}`)
	}
	catch (e) {
		console.log(`Nothing running on port ${port}`)
		console.log("error: " + e)
	}
}

const distPort = Number(5050)

killPort(3000)
killPort(distPort)

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


ServeDist()

TestWatcher([FileConfig.client], [], {
	onAdd: (path) => {
		if (path.includes(".aseprite")) {
			ExportAseprite(path)
		}
		else {
			Files.copyFile(path, FileConfig.toDistPath(path)) // this is wrong
		}

		GenerateDist("DEVELOPMENT")
		triggerClientReload()

	},
	onChange: (path) => {
		if (path.includes(".aseprite")) {
			ExportAseprite(path)
		}
		else {
			Files.copyFile(path, FileConfig.toDistPath(path)) // this is wrong
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

// for now only run server once
StartServer()
