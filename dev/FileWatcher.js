import fs from "fs"
import Path from "path"

// chatgpt code

export function FileWatcher(folders, extensions, { onAdd, onChange, onDelete }) {
	const last = new Map()
	const pending = new Map()
	let initialized = false
	let timeout = null

	function queue(file, type) {
		const prev = pending.get(file)

		if (prev == "add") {
			return
		}
		if (prev == "change" && type == "delete") {
			return
		}

		pending.set(file, type)
		scheduleFlush()
	}

	function scheduleFlush() {
		if (timeout != null) {
			return
		}

		timeout = setTimeout(flush, 0)
	}

	function flush() {
		timeout = null
		const emitted = new Set()

		for (const [file, type] of pending) {
			if (emitted.has(file)) {
				continue
			}

			if (type == "add") {
				onAdd(file)
			}
			else if (type == "change") {
				onChange(file)
			}
			else if (type == "delete") {
				onDelete(file)
			}

			emitted.add(file)
		}

		pending.clear()
	}

	function allowed(file) {
		if (!extensions || extensions.length == 0) {
			return true
		}
		return extensions.some(ext => file.endsWith(ext))
	}

	function compute() {
		const current = new Set()
		const allFiles = []

		function addFiles(folder) {
			let entries
			try {
				entries = fs.readdirSync(folder, { withFileTypes: true })
			}
			catch (e) {
				return
			}

			for (const entry of entries) {
				const file = Path.join(folder, entry.name).replaceAll("\\", "/")
				if (entry.isDirectory()) {
					addFiles(file)
				}
				else if (allowed(file)) {
					allFiles.push(file)
				}
			}
		}

		for (const f of Array.isArray(folders) ? folders : [folders]) {
			addFiles(f)
		}

		for (const file of allFiles) {
			current.add(file)

			try {
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
			catch (e) {
				// The file may disappear between the directory scan and stat; leave its previous entry for delete detection.
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

	compute()

	const interval = setInterval(compute, 50)
	return () => clearInterval(interval)
}
