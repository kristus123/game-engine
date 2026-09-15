import { AllImports } from "#root/AllImports.js"
const {
	Files,
	Paths,
	PrepareExternalBundle,
	ExportAseprite,
	ServeDist
} = AllImports

import { spawn } from "child_process"

// todo improve comment
// Needs to be imported like this because the transpiled folder is non existent before and it does not like that.
// also, we should use Import.js
const { HttpServer } = await import("#root/transpiledBackend/http/server/HttpServer.js")
const { StartServer } = await import("#root/transpiledBackend/StartServer.js")
console.log("--------------------------------------------- wow")
let { SocketServer } = await import("#root/transpiledBackend/socket/SocketServer.js")

export class HotReloader {
	static {
    	this.childProcess = null
    	this.timeout = null
    	this.reloadFrontendId = 0
    	this.reloadBackendId = 0

		SocketServer.on("GET_BACKEND_VERSION", (client, clientId, data) => {
			SocketServer.sendToClient(client, {version: this.reloadBackendId})
		})
	}

	static generateDist(callback = () => {}) {
    	const currentReloadId = ++this.reloadFrontendId

    	if (this.childProcess) {
        	this.childProcess.kill("SIGTERM")
        	this.childProcess = null
    	}

    	this.childProcess = spawn(process.execPath, ["dev/GenerateFrontend.js", "DEVELOPMENT"], {
        	stdio: "inherit"
    	})

    	this.childProcess.on("exit", (code, signal) => {
        	if (currentReloadId != this.reloadFrontendId) {
            	return
        	}
        	this.childProcess = null
        	if (code != 0) {
            	return
        	}
        	else {
            	callback()
        	}
    	})
	}

	static generateTranspiledBackend(callback = () => {}) {
    	const currentReloadId = ++this.reloadBackendId

    	if (this.childProcess) {
        	this.childProcess.kill("SIGTERM")
        	this.childProcess = null
    	}

    	this.childProcess = spawn(process.execPath, ["dev/GenerateBackend.js", "DEVELOPMENT"], {
        	stdio: "inherit"
    	})

    	this.childProcess.on("exit", (code, signal) => {
        	if (currentReloadId != this.reloadBackendId) {
            	return
        	}
        	this.childProcess = null
        	if (code != 0) {
            	return
        	}
        	else {
            	callback()
        	}
    	})
	}

	static async reloadFrontend() {
    	console.log("Frontend Reload Triggered")

    	if (this.timeout) {
        	clearTimeout(this.timeout)
    	}

    	this.timeout = setTimeout(() => {
        	SocketServer.sendToEveryone({ action: "HOT_RELOAD" })
        	this.timeout = null
    	}, 100)
	}

	static async reloadBackend() {
    	console.log("Backend Reload Triggered")

    	if (HttpServer.activeServer) {
        	HttpServer.stop()
    	}

    	await ExportAseprite()
    	PrepareExternalBundle()

    	StartServer()
	}
}