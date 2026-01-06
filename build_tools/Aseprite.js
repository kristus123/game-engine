import { execFileSync } from 'child_process'
import { existsSync } from 'fs'

const bin = (() => {
	const potentialPaths = [
		'aseprite',
		'$HOME/aseprite/build/bin/aseprite',
		'$HOME/aseprite/bin/aseprite',
	]
	for (const p of potentialPaths) {
		try {
			const out = execFileSync('which', [p], { shell: true }).toString().trim()
			if (out) {
				return p
			}
		}
		catch {
		}
		if (existsSync(p)) {
			return p
		}
	}

	throw new Error('could not find aseprite path. Put your aseprite path in: Aseprite.js')
})()


export class Aseprite {
	static tags(srcFile, destBase) {
		execFileSync(bin, [
			'-b',
			srcFile,
			'--split-tags',
			'--list-slices',
			'--sheet',
			destBase + '.png',
			'--data',
			destBase + '.json',
			'--format',
			'json-array',
			'--filename-format',
			'{tag}',
		], { stdio: 'inherit', shell: true })
	}

	static layers(srcFile, destBase) {
		execFileSync(bin, [
			'-b',
			'--split-layers',
			srcFile,
			'--sheet',
			destBase + 'Layers.png',
			'--data',
			destBase + 'Layers.json',
			'--filename-format',
			'{layer}_{frame}_{tag}',
		], { shell: true })

	}

	static tilemaps(srcFile, destBase) {
		execFileSync(bin, [
			'-b',
			srcFile,
			'--script',
			'build_tools/aseprite_to_json.lua',
			'--',
			destBase + 'Tilemaps.json',
		], { shell: true })
	}
}
