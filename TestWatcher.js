import fs from "fs"
import { Import } from "#root/Import.js"
const Files = await Import("Files")

export function TestWatcher(folders, { onAdd, onChange, onDelete }) {
	const last = new Map()
	const pending = new Map()
	let initialized = false
	let timeout = null

	function queue(file, type) {
		pending.set(file, type)

		clearTimeout(timeout)

		timeout = setTimeout(() => {
			const emitted = new Set()

			for (const [file, type] of pending) {
				if (emitted.has(file)) {
					continue
				}

				if (type == "add") {
					onAdd?.(file)
				}
				if (type == "change") {
					onChange?.(file)
				}
				if (type == "delete") {
					onDelete?.(file)
				}

				emitted.add(file)
			}

			pending.clear()
		}, 50)
	}

	function compute() {
		const current = new Set()
		const allFiles = []

		for (const f of Array.isArray(folders) ? folders : [folders]) {
			allFiles.push(...Files.at(f))
		}

		for (const file of allFiles) {
			current.add(file)

			const stat = fs.statSync(file)
			const key = stat.mtimeMs + ":" + stat.size

			const prev = last.get(file)

			if (!prev) {
				last.set(file, key)
				if (initialized) {
					queue(file, "add")
				}
			}
			else if (prev != key) {
				last.set(file, key)
				queue(file, "change")
			}
		}

		if (initialized) {
			for (const file of last.keys()) {
				if (!current.has(file)) {
					last.delete(file)
					queue(file, "delete")
				}
			}
		}

		initialized = true
	}

	for (const f of Array.isArray(folders) ? folders : [folders]) {
		compute()
	}

	setInterval(() => {
		compute()
	}, 200)
}
