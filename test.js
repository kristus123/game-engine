import fs from "node:fs"
import http from "node:http"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { chrome } from "./scripts/chrome.js"
import { PropertyTestNode } from "./scripts/PropertyTestNode.js"

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const DEFAULT_SEED = 20261006
const DEFAULT_RUNS = 10
const EXPORT_PATTERN = /\bexport\s+(?:async\s+)?(?:class|function|const|let)\s+[\w$]+/m

function parseOptions(args) {
	const options = {
		frontend: false,
		backend: false,
		update: false,
		includeSideEffects: false,
		runs: DEFAULT_RUNS,
		seed: DEFAULT_SEED,
		filter: "",
	}

	for (let index = 0; index < args.length; index++) {
		const argument = args[index]
		if (argument == "--frontend") {
			options.frontend = true
		}
		else if (argument == "--backend") {
			options.backend = true
		}
		else if (argument == "--update" || argument == "-u") {
			options.update = true
		}
		else if (argument == "--include-side-effects") {
			options.includeSideEffects = true
		}
		else if (["--runs", "--seed", "--filter"].includes(argument)) {
			const value = args[++index]
			if (value === undefined) {
				throw new Error(`${argument} needs a value`)
			}

			if (argument == "--filter") {
				options.filter = value
				continue
			}

			const number = Number(value)
			const min = argument == "--runs" ? 1 : 0
			if (!Number.isInteger(number) || number < min || number > 0xFFFFFFFF) {
				throw new Error(`${argument} needs an integer between ${min} and 4294967295`)
			}

			options[argument.slice(2)] = number
		}
		else if (argument == "--help" || argument == "-h") {
			options.help = true
		}
		else {
			throw new Error(`Unknown option: ${argument}`)
		}
	}

	if (!options.frontend && !options.backend) {
		options.frontend = true
		options.backend = true
	}

	return options
}

function printHelp() {
	console.log([
		"Usage: node test.js [--frontend] [--backend] [--runs N] [--seed N] [--filter TEXT] [--update] [--include-side-effects]",
		"Scans JavaScript modules in frontend/ and backend/, generates repeatable arguments, and snapshots each public method result.",
		"Frontend code runs in the isolated Chrome controller; backend code runs in Node from generated transpiledBackend/ modules.",
		"Run npm test -- --update to create or accept snapshots at snapshots/<frontend|backend>/<source path>/<method>/results.json.",
		"Lifecycle and external-effect method names are skipped unless --include-side-effects is passed.",
	].join("\n"))
}

async function refreshGeneratedImportIndex() {
	const { Files } = await import("./dev/Files.js")
	const names = Files.namesAndPaths("./")
	let content = "// This is a generated file and is gitignored\n"
	content += 'import { LazyImport as CreateLazyImport } from "#root/LazyImport.js"\n'
	for (const name of names.keys()) {
		content += `export const ${name} = CreateLazyImport(${JSON.stringify(name)})\n`
	}
	fs.writeFileSync(path.join(ROOT, "AllImports.js"), content)
}

async function buildRuntimes(options) {
	await refreshGeneratedImportIndex()
	const { AssertNoReservedKeywordsUsedInFileNames, AssertUniqueFileNames } = await import("./AllImports.js")
	AssertUniqueFileNames()
	AssertNoReservedKeywordsUsedInFileNames()

	if (options.frontend) {
		const { GenerateFrontend } = await import("./dev/GenerateFrontend.js")
		GenerateFrontend("DEVELOPMENT")
	}
	if (options.backend) {
		const { GenerateBackend } = await import("./dev/GenerateBackend.js")
		GenerateBackend("DEVELOPMENT")
	}
}

function makeDistServer(distFolder) {
	const page = `<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<script type="importmap">{"imports":{"#root/":"/"}}</script>
		<script type="module" src="/shared/enhance/EnhanceAll.js"></script>
	</head>
	<body><div id="canvases"></div></body>
</html>`
	const server = http.createServer((request, response) => {
		response.setHeader("Cross-Origin-Opener-Policy", "same-origin")
		response.setHeader("Cross-Origin-Embedder-Policy", "require-corp")
		response.setHeader("X-Content-Type-Options", "nosniff")

		if (request.url == "/__property_test__.html") {
			response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
			response.end(page)
			return
		}

		if (request.url == "/__property_test_runner__.js") {
			fs.readFile(path.join(ROOT, "scripts/PropertyTestBrowser.js"), (error, content) => {
				if (error) {
					response.writeHead(500)
					response.end("Could not load browser runner")
					return
				}
				response.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8" })
				response.end(content)
			})
			return
		}

		let pathname
		try {
			pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname)
		}
		catch {
			response.writeHead(400)
			response.end("Invalid URL")
			return
		}

		const file = path.resolve(distFolder, `.${pathname}`)
		const relative = path.relative(distFolder, file)
		if (relative.startsWith("..") || path.isAbsolute(relative)) {
			response.writeHead(403)
			response.end("Forbidden")
			return
		}

		const contentTypes = {
			".html": "text/html; charset=utf-8",
			".js": "text/javascript; charset=utf-8",
			".json": "application/json; charset=utf-8",
			".css": "text/css; charset=utf-8",
			".svg": "image/svg+xml",
			".png": "image/png",
			".jpg": "image/jpeg",
			".jpeg": "image/jpeg",
			".gif": "image/gif",
			".wasm": "application/wasm",
		}

		fs.readFile(file, (error, content) => {
			if (error) {
				response.writeHead(404)
				response.end("Not found")
				return
			}

			response.writeHead(200, {
				"Content-Type": contentTypes[path.extname(file)] || "application/octet-stream",
			})
			response.end(content)
		})
	})

	return new Promise((resolve, reject) => {
		server.once("error", reject)
		server.listen(0, "127.0.0.1", () => {
			const address = server.address()
			resolve({ server, url: `http://127.0.0.1:${address.port}` })
		})
	})
}

function methodSnapshot(sourcePath, method, cases, options, runtime) {
	return {
		version: 1,
		generator: "seeded-any-v1",
		runtime,
		source: sourcePath,
		export: method.exportName,
		method: method.methodName,
		kind: method.kind,
		seed: options.seed,
		runs: options.runs,
		cases,
	}
}

function outputFolder(sourcePath, method) {
	const segment = encodeURIComponent(method.folder).replaceAll(".", "%2E")
	return path.join(ROOT, "snapshots", sourcePath, segment)
}

function saveSnapshot(sourcePath, method, snapshot, update) {
	const file = path.join(outputFolder(sourcePath, method), "results.json")
	const actual = `${JSON.stringify(snapshot, null, "\t")}\n`

	if (update) {
		fs.mkdirSync(path.dirname(file), { recursive: true })
		fs.writeFileSync(file, actual)
		console.log(`  updated ${path.relative(ROOT, file)}`)
		return true
	}

	if (!fs.existsSync(file)) {
		console.error(`  missing snapshot: ${path.relative(ROOT, file)} (rerun with --update)`)
		return false
	}

	if (fs.readFileSync(file, "utf8") != actual) {
		console.error(`  changed snapshot: ${path.relative(ROOT, file)} (rerun with --update)`)
		return false
	}

	return true
}

async function runFrontendFile(sourcePath, options, browser, serverUrl, stats) {
	if (!EXPORT_PATTERN.test(fs.readFileSync(path.join(ROOT, sourcePath), "utf8"))) {
		stats.filesSkipped++
		return
	}

	let methodResults
	try {
		const relative = sourcePath.slice("frontend/".length)
		const config = {
			source: sourcePath,
			moduleUrl: `${serverUrl}/${relative.split("/").map(encodeURIComponent).join("/")}`,
			seed: options.seed,
			runs: options.runs,
			includeSideEffects: options.includeSideEffects,
		}
		const runnerUrl = `${serverUrl}/__property_test_runner__.js`
		const expression = `(async()=>{const {PropertyTestBrowser}=await import(${JSON.stringify(runnerUrl)});return PropertyTestBrowser.run(${JSON.stringify(config)})})()`
		const remote = await chrome.evaluate(browser, expression)
		methodResults = remote.value
	}
	catch (error) {
		console.error(`Could not run ${sourcePath} in Chrome: ${error.message}`)
		stats.failures++
		return
	}

	stats.filesScanned++
	for (const result of methodResults) {
		const method = result.method
		stats.methodsScanned++
		if (result.skipped) {
			console.log(`  skipped side-effect method ${sourcePath} :: ${method.methodName}`)
			stats.methodsSkipped++
			continue
		}

		const snapshot = methodSnapshot(sourcePath, method, result.cases, options, "chrome")
		if (!saveSnapshot(sourcePath, method, snapshot, options.update)) {
			stats.failures++
		}
		stats.methodsRun++
	}
}

async function runBackendFile(sourcePath, options, stats) {
	const source = path.join(ROOT, sourcePath)
	if (!EXPORT_PATTERN.test(fs.readFileSync(source, "utf8"))) {
		stats.filesSkipped++
		return
	}
	if (sourcePath == "backend/StartServer.js") {
		console.log(`Skipping server entry point ${sourcePath}`)
		stats.filesSkipped++
		return
	}

	const generatedPath = path.join(ROOT, "transpiledBackend", sourcePath.slice("backend/".length))
	let methodResults
	try {
		methodResults = await PropertyTestNode.runFile(generatedPath, sourcePath, options)
	}
	catch (error) {
		console.error(`Could not run ${sourcePath} in Node: ${error.stack ?? error.message}`)
		stats.failures++
		return
	}

	stats.filesScanned++
	for (const result of methodResults) {
		const method = result.method
		stats.methodsScanned++
		if (result.skipped) {
			console.log(`  skipped side-effect method ${sourcePath} :: ${method.methodName}`)
			stats.methodsSkipped++
			continue
		}

		const snapshot = methodSnapshot(sourcePath, method, result.cases, options, "node")
		if (!saveSnapshot(sourcePath, method, snapshot, options.update)) {
			stats.failures++
		}
		stats.methodsRun++
	}
}

async function run(options) {
	await buildRuntimes(options)
	const { Files } = await import("./dev/Files.js")
	const stats = {
		filesScanned: 0,
		filesSkipped: 0,
		methodsScanned: 0,
		methodsRun: 0,
		methodsSkipped: 0,
		failures: 0,
	}

	if (options.frontend) {
		const { server, url } = await makeDistServer(path.join(ROOT, "dist"))
		let devTools
		try {
			const endpoint = await chrome.startChrome({ headed: false })
			const connected = await chrome.connectToPage(endpoint.port)
			devTools = connected.devTools
			await chrome.navigate(devTools, `${url}/__property_test__.html`)

			const frontendFiles = Files.at("frontend")
				.filter(file => file.endsWith(".js"))
				.filter(file => !options.filter || file.includes(options.filter))
				.sort()
			for (const file of frontendFiles) {
				await runFrontendFile(file, options, devTools, url, stats)
			}
		}
		finally {
			await devTools?.close()
			await new Promise(resolve => server.close(resolve))
		}
	}

	if (options.backend) {
		const backendFiles = Files.at("backend")
			.filter(file => file.endsWith(".js"))
			.filter(file => !options.filter || file.includes(options.filter))
			.sort()
		for (const file of backendFiles) {
			await runBackendFile(file, options, stats)
		}
	}

	console.log(`Scanned ${stats.filesScanned} files; ran ${stats.methodsRun} methods; skipped ${stats.filesSkipped} files and ${stats.methodsSkipped} methods.`)
	if (stats.failures) {
		throw new Error(`${stats.failures} snapshot, import, or execution error(s).`)
	}
}

async function main() {
	process.chdir(ROOT)
	const options = parseOptions(process.argv.slice(2))
	if (options.help) {
		printHelp()
		return
	}
	await run(options)
}

main().catch(error => {
	console.error(error.stack ?? error.message)
	process.exitCode = 1
})
