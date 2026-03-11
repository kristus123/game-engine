import { execFileSync } from "child_process"
import { existsSync } from "fs"
import { FileConfig } from "#root/FileConfig.js"

const isWindows = process.platform === "win32"

const normalizePath = (p) => p?.replace(/^"(.*)"$/, "$1").trim()

const commandExists = (command) => {
	try {
		const locator = isWindows ? "where.exe" : "which"
		const out = execFileSync(locator, [command], {
			stdio: ["ignore", "pipe", "ignore"],
			shell: false,
		}).toString().trim()

		return Boolean(out)
	}
	catch {
		return false
	}
}

const firstExistingPath = (paths) => {
	for (const p of paths) {
		if (!p) {
			continue
		}

		const normalized = normalizePath(p)
		if (existsSync(normalized)) {
			return normalized
		}
	}

	return null
}

const resolveAsepriteBin = () => {
	const envPath = normalizePath(process.env.ASEPRITE_BIN)
	if (envPath && existsSync(envPath)) {
		return envPath
	}

	if (commandExists("aseprite")) {
		return "aseprite"
	}

	const home = process.env.HOME || process.env.USERPROFILE || ""

	const candidatePaths = isWindows
		? [
			"C:/Program Files/Aseprite/Aseprite.exe",
			"C:/Program Files (x86)/Aseprite/Aseprite.exe",
			`${home}/AppData/Local/Programs/Aseprite/Aseprite.exe`,
		]
		: [
			`${home}/aseprite/build/bin/aseprite`,
			`${home}/aseprite/bin/aseprite`,
			"/usr/bin/aseprite",
			"/usr/local/bin/aseprite",
		]

	const existingPath = firstExistingPath(candidatePaths)
	if (existingPath) {
		return existingPath
	}

	throw new Error(
		[
			"Could not find Aseprite.",
			"Set ASEPRITE_BIN to your local Aseprite executable path,",
			'for example on Windows: setx ASEPRITE_BIN "C:\\Program Files\\Aseprite\\Aseprite.exe"',
		].join(" ")
	)
}

const bin = resolveAsepriteBin()

export class Aseprite {
	static tags(srcFile, destBase) {
		execFileSync(bin, [
			"-b",
			srcFile,
			"--split-tags",
			"--list-slices",
			"--sheet",
			destBase + ".png",
			"--data",
			destBase + ".json",
			"--format",
			"json-array",
			"--filename-format",
			"{tag}",
		], { stdio: "inherit", shell: false })
	}

	static groups(srcFile, destBase) {
		execFileSync(bin, [
			"-b",
			"--list-layers",
			srcFile,
			"--data",
			destBase + "Groups.json",
			"--format",
			"json-array",
		], { stdio: "inherit", shell: false })
	}

	static layers(srcFile, destBase) {
		execFileSync(bin, [
			"-b",
			"--split-layers",
			srcFile,
			"--sheet",
			destBase + "Layers.png",
			"--data",
			destBase + "Layers.json",
			"--filename-format",
			"{layer}_{frame}_{tag}",
		], { stdio: "inherit", shell: false })
	}

	static tilemaps(srcFile, destBase) {
		execFileSync(bin, [
			"-b",
			srcFile,
			"--script-param", `outBase=${destBase}`,
			"--script",
			FileConfig.asepriteToJson,
		], { stdio: "inherit", shell: false })
	}
}