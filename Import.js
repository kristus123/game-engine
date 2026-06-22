import { Files } from "#root/dev/Files.js"

import { pathToFileURL } from "url"

const cache = new Map()

export async function Import(name) {
	if (cache.has(name)) {
		return cache.get(name)
	}
	else {
		const filePath = await Files.find(`${name}.js`)

		if (!filePath) {
			throw new Error(`File "${name}.js" not found`)
		}

		const mod = await import(pathToFileURL(filePath))

		if (!(name in mod)) {
			throw new Error(`Export "${name}" not found in ${filePath}`)
		}

		cache.set(name, mod[name])

		return mod[name]
	}
}
