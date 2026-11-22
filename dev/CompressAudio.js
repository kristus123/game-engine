import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { Paths } from "#root/Paths.js"

const settings = {
	sampleRate: 32_000, // 32k
	channels: 1,
	codec: "pcm_s16le",
}

function findWavFiles(folder) {
	let files = []
	for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
		const entryPath = path.join(folder, entry.name)
		if (entry.isDirectory()) {
			files = files.concat(findWavFiles(entryPath))
		}
		else if (entry.isFile() && entry.name.match(/\.wav$/i)) {
			files.push(entryPath)
		}
	}
	return files
}

export function CompressAudio() {
	const distDirectory = path.resolve(Paths.distFolder)
	if (!fs.existsSync(distDirectory)) {
		return
	}

	for (const wavFile of findWavFiles(distDirectory)) {
		const originalPath = path.resolve(wavFile)
		if (!originalPath.startsWith(distDirectory + path.sep)) {
			throw new Error(`Refusing to compress a WAV outside dist: ${wavFile}`)
		}

		const tempPath = originalPath + ".compressed.tmp"
		const result = spawnSync("ffmpeg", [
			"-nostdin",
			"-hide_banner",
			"-loglevel",
			"error",
			"-y",
			"-i",
			originalPath,
			"-map",
			"0:a:0",
			"-ar",
			String(settings.sampleRate),
			"-ac",
			String(settings.channels),
			"-c:a",
			settings.codec,
			"-f",
			"wav",
			tempPath,
		], { encoding: "utf8" })

		if (result.error || result.status != 0) {
			fs.rmSync(tempPath, { force: true })
			if (result.error?.code == "ENOENT") {
				throw new Error("ffmpeg is required to compress WAV files in dist, but it was not found on PATH.")
			}
			const details = result.error?.message || result.stderr?.trim() || `exit code ${result.status}`
			throw new Error(`Could not compress WAV in dist (${wavFile}): ${details}`)
		}

		const originalSize = fs.statSync(originalPath).size
		const compressedSize = fs.statSync(tempPath).size
		if (compressedSize < originalSize) {
			fs.renameSync(tempPath, originalPath)
		}
		else {
			fs.rmSync(tempPath)
		}
	}
}
