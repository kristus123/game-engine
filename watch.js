import chokidar from "chokidar"
import express from "express"
import path from "path"

import RandomId from "#root/dev/build_tools/RandomId.js"
import { Runner } from "#root/dev/build_tools/Runner.js"
import Files from "#root/dev/build_tools/Files.js"

import { FileConfig } from "#root/FileConfig.js"

import { execSync } from "child_process"

const killPort = (port) => {
	if (process.platform === "win32") {
		console.log(`Skipping killPort on Windows for ${port}`)
		return
	}

	try {
		execSync(`fuser -k ${port}/tcp`)
		console.log(`Killed process on port ${port}`)
	}
	catch {
		console.log(`Nothing running on port ${port}`)
	}
}

killPort(3000)
killPort(5000)
Files.deleteFolder(FileConfig.dist)

let currentId = RandomId()
let idTimeout = null

const app = express()
app.use(express.static(FileConfig.dist))

app.get("/", (req, res) => {
	res.sendFile(path.resolve(FileConfig.dist, "index.html"))
})

app.get("/currentId", (req, res) => {
	res.json({ currentId: currentId })
})

app.listen(5000, () => console.log("Serving dist on port 5000"))

const watcher = chokidar.watch([FileConfig.client], {
	ignoreInitial: true,
	persistent: true,
	usePolling: true,
})

watcher.on("all", (e, changedPath) => {
	console.log("changed", changedPath)

	if (e === "unlink" || e === "unlinkDir") {
		console.log("rebuilding dist")
		Files.deleteFolder(FileConfig.dist)

		new Runner(FileConfig.exportAseprite).start()
	}

	if (changedPath.includes(".aseprite")) {
		new Runner(FileConfig.exportAseprite, [changedPath]).start()
	}

	new Runner(FileConfig.generateDist, ["DEVELOPMENT"]).start()

	if (idTimeout) {
		clearTimeout(idTimeout)
	}

	idTimeout = setTimeout(() => {
		currentId = RandomId()
		idTimeout = null
	}, 500)
})

// initial build
new Runner(FileConfig.exportAseprite).start()
new Runner(FileConfig.generateDist, ["DEVELOPMENT"]).start()

// for now only run it once
new Runner("server/socket/SocketServer.js").start()
new Runner("server/http/main.js").start()