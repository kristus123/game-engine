import chokidar from "chokidar"
import express from "express"

import RandomId from "#root/dev/build_tools/RandomId.js"
import { Runner } from "#root/dev/build_tools/Runner.js"
import Files from "#root/dev/build_tools/Files.js"

import { FileConfig } from "#root/FileConfig.js"

import { execSync } from "child_process"

const killPort = (port) => {
	try {
		execSync(`fuser -k ${port}/tcp`)
		console.log(`Killed process on port ${port}`)
	}
	catch (e) {
		console.log(`Nothing running on port ${port}`)
		console.log("error: " + e)
	}
}

killPort(3000)
killPort(5000)

Files.deleteFolder(FileConfig.dist)

let currentId = RandomId()

let idTimeout = null

function triggerClientReload() {
	if (idTimeout) {
		clearTimeout(idTimeout)
	}

	idTimeout = setTimeout(() => {
		currentId = RandomId()
		idTimeout = null
	}, 100)
}

const app = express()
app.use(express.static(FileConfig.dist))

app.get("/currentId", (req, res) => { // this is used for hot-reloading. Check HotReload.js
	res.json({ currentId: currentId })
})

app.listen(5000, "0.0.0.0", () => console.log("Serving dist on port 5000"))

const watcher = chokidar.watch([FileConfig.client], {
	ignoreInitial: true,
	persistent: true,
	usePolling: true,
})

watcher.on("all", (e, path) => {
	console.log("changed", path)

	console.log(e)
	console.log(path)
	switch (e) {
		case "change": { // folder created
			break
		}
		case "add": { // file created
			break
		}
		case "addDir": { // folder created
			break
		}
		case "unlink": { // file deleted
			Files.deleteFile("dist/" + path)
			new Runner(FileConfig.exportAseprite).start()
			break
		}
		case "unlinkDir": { // folder deleted
			Files.deleteFolder("dist/" + path)
			break
		}
		default: {
			throw new Error("unexpected e: " + e)
		}
	}

	new Runner(FileConfig.generateDist, ["DEVELOPMENT"]).start()

	triggerClientReload()
})


// initial build
new Runner(FileConfig.exportAseprite).start()
new Runner(FileConfig.generateDist, ["DEVELOPMENT"]).start()

// for now only run it once
new Runner("server/http/main.js").start()
