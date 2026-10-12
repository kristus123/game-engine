import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

export class ConvertControlFlowSyntax {
	static folders = ["frontend", "backend"]

	static filesAt(directory) {
		return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
			const file = path.join(directory, entry.name)
			return entry.isDirectory() ? this.filesAt(file) : [file]
		})
	}

	static matchingParenthesis(line, openIndex) {
		let depth = 0
		let quote = null
		let escaped = false

		for (let i = openIndex; i < line.length; i++) {
			const character = line[i]
			if (quote != null) {
				if (escaped) {
					escaped = false
				}
				else if (character == "\\") {
					escaped = true
				}
				else if (character == quote) {
					quote = null
				}
				continue
			}

			if (character == "\"" || character == "'" || character == "`") {
				quote = character
			}
			else if (character == "(") {
				depth += 1
			}
			else if (character == ")") {
				depth -= 1
				if (depth == 0) {
					return i
				}
			}
		}

		return -1
	}

	static line(line) {
		const match = line.match(/^(\s*)(if|else if|switch)\s*\(/)
		if (match == null) {
			return line
		}

		const openIndex = match[0].lastIndexOf("(")
		const closeIndex = this.matchingParenthesis(line, openIndex)
		const remainder = line.slice(closeIndex + 1)
		if (closeIndex == -1 || !/^\s*\{(?:\s*\/\/.*)?\s*$/.test(remainder)) {
			return line
		}

		return line.slice(0, openIndex) + line.slice(openIndex + 1, closeIndex) + remainder
	}

	static content(source) {
		return source.split("\n").map(line => this.line(line)).join("\n")
	}

	static run({ check = false } = {}) {
		const changedFiles = []
		let changedLines = 0

		const files = this.folders
			.flatMap(folder => this.filesAt(folder))
			.filter(file => file.endsWith(".js"))

		for (const file of files) {
			const source = fs.readFileSync(file, "utf8")
			if (source.includes("// disable-transpiling")) {
				continue
			}

			const converted = this.content(source)
			if (converted == source) {
				continue
			}

			changedFiles.push(file.replaceAll("\\", "/"))
			const before = source.split("\n")
			const after = converted.split("\n")
			changedLines += before.filter((line, index) => line != after[index]).length
			if (!check) {
				fs.writeFileSync(file, converted)
			}
		}

		return { changedFiles, changedLines }
	}
}

if (process.argv[1] == fileURLToPath(import.meta.url)) {
	const check = process.argv.includes("--check")
	const result = ConvertControlFlowSyntax.run({ check })
	if (result.changedFiles.length == 0) {
		console.log("Control-flow source syntax is clean")
	}
	else if (check) {
		console.error(`${result.changedLines} control-flow headers need conversion in ${result.changedFiles.length} files`)
		for (const file of result.changedFiles) {
			console.error(file)
		}
		process.exitCode = 1
	}
	else {
		console.log(`Converted ${result.changedLines} control-flow headers in ${result.changedFiles.length} files`)
	}
}
