import { spawn } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { join, resolve } from "node:path"
import { tmpdir } from "node:os"
import { pathToFileURL } from "node:url"

const PROFILE_DIR = process.env.GAME_ENGINE_CHROME_PROFILE || join(
	tmpdir(),
	`game-engine-chrome-${process.getuid?.() ?? "user"}`
)
const ACTIVE_PORT_FILE = join(PROFILE_DIR, "DevToolsActivePort")
const TARGET_FILE = join(PROFILE_DIR, "controlled-target-id")
const DEFAULT_URL = "http://localhost:5050"
const DEFAULT_SCREENSHOT = join(tmpdir(), "game-engine-chrome.png")

class DevToolsConnection {
	constructor(socket) {
		this.socket = socket
		this.nextId = 1
		this.pending = new Map()
		this.listeners = new Map()

		socket.addEventListener("message", event => this.handleMessage(event.data))
		socket.addEventListener("close", () => {
			for (const { reject, timer } of this.pending.values()) {
				clearTimeout(timer)
				reject(new Error("Chrome closed the DevTools connection"))
			}
			this.pending.clear()
		})
	}

	static async connect(webSocketUrl) {
		if (typeof WebSocket != "function") {
			throw new Error("This script needs Node.js 22 or newer for its built-in WebSocket")
		}

		const socket = new WebSocket(webSocketUrl)
		await new Promise((resolve, reject) => {
			const timeout = setTimeout(() => reject(new Error("Timed out connecting to Chrome")), 5000)
			socket.addEventListener("open", () => {
				clearTimeout(timeout)
				resolve()
			}, { once: true })
			socket.addEventListener("error", () => {
				clearTimeout(timeout)
				reject(new Error("Could not connect to Chrome's DevTools endpoint"))
			}, { once: true })
		})

		return new DevToolsConnection(socket)
	}

	handleMessage(message) {
		const data = JSON.parse(message)
		if (data.id) {
			const pending = this.pending.get(data.id)
			if (!pending) {
				return
			}
			this.pending.delete(data.id)
			clearTimeout(pending.timer)
			if (data.error) {
				pending.reject(new Error(data.error.message))
			}
			else {
				pending.resolve(data.result)
			}
			return
		}

		for (const listener of this.listeners.get(data.method) || []) {
			listener(data.params)
		}
	}

	send(method, params = {}) {
		const id = this.nextId++
		return new Promise((resolve, reject) => {
			const timer = setTimeout(() => {
				this.pending.delete(id)
				reject(new Error(`Chrome DevTools command timed out: ${method}`))
			}, 30000)
			this.pending.set(id, { resolve, reject, timer })
			this.socket.send(JSON.stringify({ id, method, params }))
		})
	}

	on(method, listener) {
		const listeners = this.listeners.get(method) || []
		listeners.push(listener)
		this.listeners.set(method, listeners)
	}

	waitFor(method, timeout = 30000) {
		return new Promise((resolve, reject) => {
			const removeListener = () => {
				const listeners = this.listeners.get(method) || []
				this.listeners.set(method, listeners.filter(item => item != listener))
			}
			const timer = setTimeout(() => {
				removeListener()
				reject(new Error(`Timed out waiting for Chrome event: ${method}`))
			}, timeout)
			const listener = params => {
				clearTimeout(timer)
				removeListener()
				resolve(params)
			}
			this.on(method, listener)
		})
	}

	async close() {
		if (this.socket.readyState == WebSocket.OPEN) {
			this.socket.close()
		}
	}
}

function delay(milliseconds) {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function chromePath() {
	const configuredPath = process.env.CHROME_PATH || process.env.GOOGLE_CHROME_BIN
	if (configuredPath) {
		return configuredPath
	}

	const candidates = process.platform == "darwin"
		? ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"]
		: process.platform == "win32"
			? [
				join(process.env.PROGRAMFILES || "C:\\Program Files", "Google/Chrome/Application/chrome.exe"),
				join(process.env["PROGRAMFILES(X86)"] || "C:\\Program Files (x86)", "Google/Chrome/Application/chrome.exe"),
			]
			: ["/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium", "/usr/bin/chromium-browser"]

	const found = candidates.find(candidate => existsSync(candidate))
	if (!found) {
		throw new Error("Chrome was not found. Install Chrome or set CHROME_PATH to its executable.")
	}
	return found
}

async function readEndpoint() {
	try {
		const port = Number(readFileSync(ACTIVE_PORT_FILE, "utf8").split("\n")[0])
		if (!port) {
			return null
		}
		const response = await fetch(`http://127.0.0.1:${port}/json/version`)
		if (!response.ok) {
			return null
		}
		const version = await response.json()
		return { port, version }
	}
	catch {
		return null
	}
}

async function startChrome({ headed }) {
	mkdirSync(PROFILE_DIR, { recursive: true, mode: 0o700 })
	const activeEndpoint = await readEndpoint()
	if (activeEndpoint) {
		return activeEndpoint
	}

	rmSync(ACTIVE_PORT_FILE, { force: true })
	const chromeArgs = [
		"--remote-debugging-address=127.0.0.1",
		"--remote-debugging-port=0",
		"--remote-allow-origins=*",
		"--disable-crash-reporter",
		"--disable-breakpad",
		`--user-data-dir=${PROFILE_DIR}`,
		"--no-first-run",
		"--no-default-browser-check",
		"about:blank",
	]
	if (!headed) {
		chromeArgs.unshift(
			"--headless=new",
			"--no-sandbox",
			"--use-fake-device-for-media-stream",
			"--use-fake-ui-for-media-stream",
		)
	}
	const child = spawn(chromePath(), chromeArgs, {
		stdio: "ignore",
		detached: true,
	})
	let launchError
	child.once("error", error => {
		launchError = error
	})
	child.once("exit", (code, signal) => {
		if (code != 0) {
			launchError = new Error(`Chrome exited before starting (code: ${code}, signal: ${signal})`)
		}
	})
	child.unref()

	const deadline = Date.now() + 15000
	while (Date.now() < deadline) {
		if (launchError) {
			throw launchError
		}
		const endpoint = await readEndpoint()
		if (endpoint) {
			return endpoint
		}
		await delay(100)
	}
	throw new Error("Chrome did not start its DevTools endpoint within 15 seconds")
}

async function getTargets(port) {
	const response = await fetch(`http://127.0.0.1:${port}/json/list`)
	if (!response.ok) {
		throw new Error("Could not list Chrome tabs")
	}
	return response.json()
}

async function getPageTarget(port) {
	const targets = (await getTargets(port)).filter(target => target.type == "page")
	if (!targets.length) {
		throw new Error("Chrome has no open page to control")
	}

	let targetId
	try {
		targetId = readFileSync(TARGET_FILE, "utf8").trim()
	}
	catch { }

	const target = targets.find(item => item.id == targetId) || targets[0]
	writeFileSync(TARGET_FILE, target.id)
	return target
}

async function connectToPage(port) {
	const target = await getPageTarget(port)
	const devTools = await DevToolsConnection.connect(target.webSocketDebuggerUrl)
	devTools.on("Runtime.consoleAPICalled", event => {
		const values = event.args.map(argument => {
			if (Object.hasOwn(argument, "value")) {
				return typeof argument.value == "string"
					? argument.value
					: JSON.stringify(argument.value)
			}
			return argument.description || argument.type
		})
		console.log(`[browser ${event.type}] ${values.join(" ")}`)
	})
	devTools.on("Runtime.exceptionThrown", event => {
		console.error(`[browser exception] ${event.exceptionDetails.exception?.description || event.exceptionDetails.text}`)
	})
	await devTools.send("Page.enable")
	await devTools.send("Runtime.enable")
	return { devTools, target }
}

async function evaluate(devTools, expression) {
	const response = await devTools.send("Runtime.evaluate", {
		expression,
		awaitPromise: true,
		returnByValue: true,
		userGesture: true,
	})
	if (response.exceptionDetails) {
		throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text)
	}
	return response.result
}

function printValue(remoteObject) {
	if (Object.hasOwn(remoteObject, "value")) {
		const value = remoteObject.value
		console.log(typeof value == "string" ? value : JSON.stringify(value, null, 2))
		return
	}
	console.log(remoteObject.description || remoteObject.unserializableValue || remoteObject.type)
}

async function navigate(devTools, url) {
	const loaded = devTools.waitFor("Page.loadEventFired")
	try {
		const result = await devTools.send("Page.navigate", { url })
		if (result.errorText) {
			throw new Error(result.errorText)
		}
		await loaded
	}
	catch (error) {
		loaded.catch(() => {})
		throw error
	}
}

function printHelp() {
	console.log(`Chrome CDP controller (no browser automation packages)

Usage: npm run chrome -- [command] [arguments]
   	npm run chrome

Commands:
  start [--headed] [url]   Launch isolated Chrome and open the URL (default: ${DEFAULT_URL})
  status                   Print the current page URL, title, and ready state
  goto <url>               Navigate the controlled tab
  eval <javascript>        Evaluate an expression in the page and print its result
  click <css-selector>     Scroll to and click the matching element
  type <css-selector> <text>
           				Focus the matching element and type text at its caret
  screenshot [file]        Save a PNG (default: ${DEFAULT_SCREENSHOT})
  reload                   Reload the current page
  stop                     Close this isolated Chrome instance
  help                     Show this help

Set CHROME_PATH if Chrome is not in a standard install location.
The browser uses a separate profile under the operating system's temp directory.`)
}

async function main() {
	const [command = "start", ...args] = process.argv.slice(2)
	if (command == "help" || command == "--help" || command == "-h") {
		return printHelp()
	}
	const commands = ["start", "status", "goto", "eval", "click", "type", "screenshot", "reload", "stop"]
	if (!commands.includes(command)) {
		printHelp()
		process.exitCode = 1
		return
	}

	if (command == "stop") {
		const endpoint = await readEndpoint()
		if (!endpoint) {
			return console.log("Chrome is not running")
		}
		const devTools = await DevToolsConnection.connect(endpoint.version.webSocketDebuggerUrl)
		await devTools.send("Browser.close").catch(() => {})
		await devTools.close()
		return console.log("Closed the isolated Chrome instance")
	}

	const headed = command == "start" && args[0] == "--headed"
	const url = args[headed ? 1 : 0] || DEFAULT_URL
	const endpoint = command == "start" ? await startChrome({ headed }) : await readEndpoint()
	if (!endpoint) {
		throw new Error("Chrome is not running. Start it first with: node scripts/chrome.js start")
	}

	const { devTools, target } = await connectToPage(endpoint.port)
	try {
		if (command == "start") {
			await navigate(devTools, url)
			console.log(`Chrome is ready at ${url} (${headed ? "headed" : "headless"})`)
		}
		else if (command == "status") {
			const result = await evaluate(devTools, "({ url: location.href, title: document.title, readyState: document.readyState })")
			printValue(result)
		}
		else if (command == "goto") {
			if (!args[0]) {
				throw new Error("Usage: node scripts/chrome.js goto <url>")
			}
			await navigate(devTools, args[0])
			console.log(`Navigated to ${args[0]}`)
		}
		else if (command == "eval") {
			if (!args.length) {
				throw new Error("Usage: node scripts/chrome.js eval <javascript>")
			}
			printValue(await evaluate(devTools, args.join(" ")))
		}
		else if (command == "click") {
			if (!args[0]) {
				throw new Error("Usage: node scripts/chrome.js click <css-selector>")
			}
			const selector = JSON.stringify(args.join(" "))
			const position = await evaluate(devTools, `(() => {
				const element = document.querySelector(${selector})
				if (!element) throw new Error("No element matches the selector")
				element.scrollIntoView({ block: "center", inline: "center" })
				const rect = element.getBoundingClientRect()
				return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
			})()`)
			const { x, y } = position.value
			await devTools.send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y })
			await devTools.send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount: 1 })
			await devTools.send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount: 1 })
			console.log(`Clicked ${args.join(" ")}`)
		}
		else if (command == "type") {
			if (args.length < 2) {
				throw new Error("Usage: node scripts/chrome.js type <css-selector> <text>")
			}
			const selector = JSON.stringify(args[0])
			await evaluate(devTools, `(() => {
				const element = document.querySelector(${selector})
				if (!element) throw new Error("No element matches the selector")
				element.focus()
			})()`)
			await devTools.send("Input.insertText", { text: args.slice(1).join(" ") })
			console.log(`Typed into ${args[0]}`)
		}
		else if (command == "screenshot") {
			const file = resolve(args[0] || DEFAULT_SCREENSHOT)
			const screenshot = await devTools.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true })
			writeFileSync(file, Buffer.from(screenshot.data, "base64"))
			console.log(`Saved screenshot to ${file}`)
		}
		else if (command == "reload") {
			const loaded = devTools.waitFor("Page.loadEventFired")
			try {
				await devTools.send("Page.reload")
				await loaded
			}
			catch (error) {
				loaded.catch(() => {})
				throw error
			}
			console.log(`Reloaded ${target.url}`)
		}
		else {
			printHelp()
			process.exitCode = 1
		}
	}
	finally {
		await devTools.close()
	}
}

export const chrome = { readEndpoint, startChrome, connectToPage, evaluate, navigate }

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href == import.meta.url) {
	main().catch(error => {
		console.error(error.message)
		process.exitCode = 1
	})
}
