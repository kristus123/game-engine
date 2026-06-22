import chokidar from "chokidar"
import express from "express"

import { Import } from "#root/Import.js"

import { Files } from "#root/dev/Files.js"

import { FileConfig } from "#root/FileConfig.js"

import { execSync } from "child_process"
import { GenerateDist } from "#root/dev/GenerateDist.js"
import { PrepareExternalBundle } from "#root/dev/PrepareExternalBundle.js"
import { StartServer } from "#root/backend/server/http/StartServer.js"
import { socketServer } from "#root/backend/server/socket/SocketServer.js"
import { VerifyNoReservedClashes } from "#root/dev/VerifyNoReservedClashes.js"
import { AssertUniqueFileNames } from "#root/dev/AssertUniqueFileNames.js"

const ExportAseprite = await Import("ExportAseprite")

AssertUniqueFileNames()
VerifyNoReservedClashes()

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
		socketServer.sendToEveryone({ action: "HOT_RELOAD" })
		idTimeout = null
	}, 50)
}


const app = express()
app.use(express.static(FileConfig.dist))

app.use((req, res, next) => { // needed in order to use shared array buffers between main and worker
	res.setHeader("Cross-Origin-Opener-Policy", "same-origin")
	res.setHeader("Cross-Origin-Embedder-Policy", "require-corp")
	next()
})


app.listen(distPort, "0.0.0.0", () => console.log(`Serving dist on port ${distPort}`))

const watcher = chokidar.watch([FileConfig.client], {
	ignoreInitial: true,
	persistent: true,
	usePolling: true,
})

watcher.on("all", (e, path) => {
	try {
		console.log("changed", path)

		console.log(e)
		console.log(path)
		if (path.includes(".css")) {
			// do nothing as of now
		}
		else {
			switch (e) {
				case "change": { // file changed
					if (path.includes(".aseprite")) {
						ExportAseprite(path)
					}
					else {
						Files.copyFile(path, FileConfig.toDistPath(path))
					}
					break
				}

				case "add": { // file created
					if (path.includes(".aseprite")) {
						ExportAseprite(path)
					}
					else {
						Files.copyFile(path, FileConfig.toDistPath(path))
					}
					break
				}

				case "addDir": { // folder created
					Files.createFolder(FileConfig.toDistPath(path))
					break
				}

				case "unlink": { // file deleted
					Files.deleteFile(FileConfig.toDistPath(path))
					break
				}

				case "unlinkDir": { // folder deleted
					Files.deleteFolder(FileConfig.toDistPath(path))
					break
				}

				default: {
					throw new Error("unexpected e: " + e)
				}
			}
		}

		GenerateDist("DEVELOPMENT")
		triggerClientReload()
	}
	catch (e) {
		console.log(e)
	}
})


// initial build
ExportAseprite()
GenerateDist("DEVELOPMENT")
PrepareExternalBundle()

// for now only run it once
StartServer()
