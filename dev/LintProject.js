import fs from "node:fs"
import path from "node:path"
import { createHash } from "node:crypto"
import { spawn } from "node:child_process"
import { fileURLToPath } from "node:url"
import { Files } from "./Files.js"
import { UpdateEslint } from "./UpdateEslint.js"
import { ConvertControlFlowSyntax } from "./ConvertControlFlowSyntax.js"

export async function LintProject() {
	if (process.argv.length > 2) {
		throw new Error("Usage: scripts/lint.sh")
	}

	const started = performance.now()
	const folders = ["frontend", "backend", "shared", "dev", "scripts", "prod", "documentation"]
	const sourceFiles = [
		...fs.readdirSync(".", { withFileTypes: true }).filter(entry => entry.isFile()).map(entry => entry.name),
		...folders.flatMap(folder => Files.at(folder)),
	]
	const zoneIdentifierFiles = sourceFiles.filter(file => path.basename(file).endsWith(":Zone.Identifier"))
	for (const file of zoneIdentifierFiles) {
		fs.unlinkSync(file)
	}
	if (zoneIdentifierFiles.length > 0) {
		console.log(`Removed ${zoneIdentifierFiles.length} Zone.Identifier file(s)`)
	}
	const files = [
		...sourceFiles.filter(file => !zoneIdentifierFiles.includes(file)),
	].filter(file => !["Secrets.js", "AllImports.js"].includes(path.basename(file)))
	const cacheFolder = ".cache/lint"
	fs.mkdirSync(cacheFolder, { recursive: true })
	UpdateEslint(files.filter(file => /^(frontend|backend|shared|dev)\//.test(file)))

	function hash(content) {
		return createHash("sha256").update(content).digest("hex")
	}

	function configsFor(prefix, extraFiles) {
		return [...new Set([...extraFiles, ...files.filter(file => {
			const basename = path.basename(file)
			return basename.startsWith(`.${prefix}rc`) || basename.startsWith(`${prefix}.config.`)
				|| basename == `.${prefix}ignore` || basename == "package.json"
				|| (prefix == "prettier" && basename == ".editorconfig")
		})])].sort()
	}

	const signature = hash(JSON.stringify([process.cwd(), process.version, ...[
		...configsFor("eslint", [".eslintrc.json", ".eslintignore"]),
		"package-lock.json",
		"dev/LintProject.js",
		"dev/ConvertControlFlowSyntax.js",
	].map(file => [file, fs.existsSync(file) ? hash(fs.readFileSync(file)) : null])]))
	const cachePath = `${cacheFolder}/javascript.json`
	let previous = {}
	try {
		const saved = JSON.parse(fs.readFileSync(cachePath, "utf8"))
		if (saved.signature == signature) {
			previous = saved.files
		}
	}
	catch (error) {
		if (error.code != "ENOENT" && !(error instanceof SyntaxError)) {
			throw error
		}
	}

	async function lintJavaScript() {
		const { ESLint } = await import("eslint")
		const eslint = new ESLint({
			fix: true,
			plugins: {
				project: {
					rules: {
						"loose-equality": {
							meta: { fixable: "code", schema: [] },
							create(context) {
								return {
									BinaryExpression(node) {
										if (node.operator != "===" && node.operator != "!==") {
											return
										}
										const token = context.getSourceCode().getFirstTokenBetween(node.left, node.right,
											token => token.value == node.operator)
										context.report({
											node,
											message: "Use == or != for project equality comparisons",
											fix: fixer => fixer.replaceText(token, node.operator.slice(0, -1)),
										})
									},
								}
							},
						},
					},
				},
			},
			overrideConfig: { plugins: ["project"], rules: { "project/loose-equality": "error" } },
		})
		const results = []
		const cache = {}
		let checked = 0
		let cached = 0

		for (const file of files.filter(file => file.endsWith(".js"))) {
			if (await eslint.isPathIgnored(file)) {
				continue
			}
			const source = fs.readFileSync(file, "utf8")
			const fingerprint = hash(source)
			if (previous[file]?.hash == fingerprint) {
				cache[file] = previous[file]
				results.push(previous[file].result)
				cached += 1
				continue
			}

			const custom = /^(frontend|backend)\//.test(file) && !source.includes("// disable-transpiling")
			const normalized = source.replace(/^[\t ]+/gm, indent => indent.replaceAll("    ", "\t"))
			const input = custom ? ConvertControlFlowSyntax.forLint(normalized) : normalized
			const [result] = await eslint.lintText(input, { filePath: file })
			const output = result.output ?? input
			const finalSource = custom ? ConvertControlFlowSyntax.fromLint(output) : output
			if (custom) {
				const lines = output.split("\n")
				const synthetic = lines.map(line => line.includes("break /* lint-implicit-break */"))
				result.messages = result.messages.filter(message => {
					if (message.ruleId == "no-unreachable" && synthetic[message.line - 1]) {
						result.errorCount -= 1
						return false
					}
					const removedBefore = line => synthetic.slice(0, line - 1).filter(Boolean).length
					if (message.endLine != null) {
						message.endLine -= removedBefore(message.endLine)
					}
					message.line -= removedBefore(message.line)
					return true
				})
			}
			// Leave malformed source intact so a parser failure cannot corrupt it.
			if (result.fatalErrorCount == 0 && finalSource != source) {
				fs.writeFileSync(file, finalSource)
			}
			delete result.source
			delete result.output
			cache[file] = { hash: hash(fs.readFileSync(file, "utf8")), result }
			results.push(result)
			checked += 1
		}

		fs.writeFileSync(cachePath, JSON.stringify({ signature, files: cache }))
		const formatter = await eslint.loadFormatter("stylish")
		const report = formatter.format(results)
		return { report, checked, cached, exitCode: results.some(result => result.errorCount > 0) ? 1 : 0 }
	}

	async function lintCss() {
		const css = files.filter(file => file.endsWith(".css"))
		if (css.length == 0) {
			return { report: "", exitCode: 0 }
		}
		const { default: stylelint } = await import("stylelint")
		const result = await stylelint.lint({
			files: css,
			fix: true,
			cache: true,
			cacheStrategy: "content",
			cacheLocation: `${cacheFolder}/stylelint`,
			formatter: "string",
		})
		return { report: result.report, exitCode: result.errored ? 1 : 0 }
	}

	function formatHtml() {
		const html = files.filter(file => file.endsWith(".html"))
		if (html.length == 0) {
			return Promise.resolve({ report: "", exitCode: 0 })
		}
		return new Promise((resolve, reject) => {
			const child = spawn(process.execPath, [
				"node_modules/prettier/bin/prettier.cjs",
				...html,
				"--write",
				// The stage cache already skips unchanged HTML; recheck changed input fully.
				"--cache-location",
				`${cacheFolder}/prettier`,
				"--log-level",
				"warn",
			], { stdio: ["ignore", "pipe", "pipe"] })
			let report = ""
			child.stdout.on("data", chunk => {
				report += chunk
			})
			child.stderr.on("data", chunk => {
				report += chunk
			})
			child.on("error", reject)
			child.on("close", code => resolve({ report, exitCode: code ?? 2 }))
		})
	}

	const stageCachePath = `${cacheFolder}/stages.json`
	let stageCache = {}
	try {
		stageCache = JSON.parse(fs.readFileSync(stageCachePath, "utf8"))
	}
	catch (error) {
		if (error.code != "ENOENT" && !(error instanceof SyntaxError)) {
			throw error
		}
	}
	const commonSignature = hash(JSON.stringify([
		process.cwd(),
		process.version,
		...[
			"package.json",
			"package-lock.json",
			"dev/LintProject.js",
			"dev/ConvertControlFlowSyntax.js",
			"dev/UpdateEslint.js",
		].map(file => [file, hash(fs.readFileSync(file))]),
	]))
	const nextStageCache = {}

	async function runCached(name, extension, configFiles, run) {
		const configPrefix = { JavaScript: "eslint", CSS: "stylelint", HTML: "prettier" }[name]
		const inputs = [...new Set([
			...files.filter(file => file.endsWith(extension)), ...configsFor(configPrefix, configFiles),
		])].sort()
		function fingerprint() {
			return hash(JSON.stringify([commonSignature, ...inputs.map(file => [
				file, fs.existsSync(file) ? hash(fs.readFileSync(file)) : null,
			])]))
		}
		const before = fingerprint()
		const previousStage = stageCache[name]
		if (previousStage?.fingerprint == before) {
			nextStageCache[name] = previousStage
			const result = { ...previousStage.result }
			if (name == "JavaScript") {
				result.cached += result.checked
				result.checked = 0
			}
			return result
		}
		const result = await run()
		// Cache diagnostic reports too, so unchanged errors still fail visibly.
		if (name != "HTML" || result.exitCode == 0) {
			nextStageCache[name] = { fingerprint: fingerprint(), result }
		}
		return result
	}

	console.log("Linting source files")
	const results = await Promise.allSettled([
		runCached("JavaScript", ".js", [".eslintrc.json", ".eslintignore"], lintJavaScript),
		runCached("CSS", ".css", ["stylelint.config.js", ".stylelintignore"], lintCss),
		runCached("HTML", ".html", [".prettierrc", ".prettierignore", ".editorconfig"], formatHtml),
	])
	fs.writeFileSync(stageCachePath, JSON.stringify(nextStageCache))
	let exitCode = 0
	for (const result of results) {
		if (result.status == "rejected") {
			console.error(result.reason)
			exitCode = 2
		}
		else {
			if (result.value.report) {
				console.log(result.value.report)
			}
			if (result.value.checked != null) {
				console.log(`JavaScript: ${result.value.checked} checked, ${result.value.cached} cached`)
			}
			exitCode = Math.max(exitCode, result.value.exitCode)
		}
	}
	const outcome = exitCode == 0 ? "passed" : exitCode == 1 ? "has remaining errors" : "could not complete"
	console.log(`Lint ${outcome} (exit ${exitCode}) in ${((performance.now() - started) / 1000).toFixed(2)}s`)
	return exitCode
}

if (process.argv[1] == fileURLToPath(import.meta.url)) {
	try {
		process.exitCode = await LintProject()
	}
	catch (error) {
		console.error(error)
		process.exitCode = 2
	}
}
