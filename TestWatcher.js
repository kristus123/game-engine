import fs from "fs"
import { Import } from "#root/Import.js"

const Files = await Import("Files")

function Try(fn) {
	try {
		return fn()
	} catch (e) {
		console.log("ERROR", e)
	}
}

export function TestWatcher(folders, extensions, { onAdd, onChange, onDelete }) {
	const last = new Map()
	const pending = new Map()
	const seen = new Set()

	let initialized = false
	let timeout = null
	let running = false

	const folderList = Array.isArray(folders) ? folders : [folders]

	function allowed(file) {
		if (!extensions?.length) return true
		for (const ext of extensions) {
			if (file.endsWith(ext)) return true
		}
		return false
	}

	function queue(file, type) {
		const prev = pending.get(file)

		if (prev === "add") return
		if (prev === "change" && type === "delete") return

		pending.set(file, type)
		scheduleFlush()
	}

	function scheduleFlush() {
		clearTimeout(timeout)
		timeout = setTimeout(flush, 10)
	}

	function flush() {
		if (running) return
		running = true

		for (const [file, type] of pending) {
			if (seen.has(file)) continue
			seen.add(file)

			if (type === "add") Try(() => onAdd(file))
			else if (type === "change") Try(() => onChange(file))
			else if (type === "delete") Try(() => onDelete(file))
		}

		pending.clear()
		seen.clear()
		running = false
	}

	function compute() {
		const current = new Set()

		for (const f of folderList) {
			for (const file of Files.at(f)) {
				if (!allowed(file)) continue

				current.add(file)

				let stat
				try {
					stat = fs.statSync(file)
				} catch {
					continue
				}

				const key = stat.mtimeMs + ":" + stat.size
				const prev = last.get(file)

				if (!prev) {
					last.set(file, key)
					if (initialized) queue(file, "add")
				} else if (prev !== key) {
					last.set(file, key)
					queue(file, "change")
				}
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
	setInterval(compute, 50)
}
