import chokidar from "chokidar"
import express from "express"

import { RandomId } from "#root/dev/RandomId.js"
import { Files } from "#root/dev/Files.js"

import { Import } from "#root/Import.js"

import { FileConfig } from "#root/FileConfig.js"

import { execSync } from "child_process"
import { ExportAseprite } from "#root/dev/ExportAseprite.js"
import { GenerateDist } from "#root/dev/GenerateDist.js"
import { GenerateTranspiledBackend } from "#root/dev/GenerateTranspiledBackend.js"



import { PrepareExternalBundle } from "#root/dev/PrepareExternalBundle.js"

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
Files.deleteFolder(FileConfig.transpiledBackend)

let currentId = RandomId()

let idTimeout = null

function triggerClientReload() {
	if (idTimeout) {
		clearTimeout(idTimeout)
	}

	idTimeout = setTimeout(() => {
		currentId = RandomId()
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

app.get("/currentId", (req, res) => { // this is used for hot-reloading. Check HotReload.js
	res.json({ currentId: currentId })
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
		GenerateTranspiledBackend("DEVELOPMENT")
		triggerClientReload()
	}
	catch (e) {
		console.log(e)
	}
})

console.log("hei")


// initial build
ExportAseprite()
GenerateDist("DEVELOPMENT")
GenerateTranspiledBackend("DEVELOPMENT")
PrepareExternalBundle()

// for now only run it once
import { StartServer } from "#root/transpiledBackend/server/http/StartServer.js"

StartServer()
