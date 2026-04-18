import { execFileSync } from "child_process"
import { existsSync } from "fs"
import { FileConfig } from "#root/FileConfig.js"
import os from "os"
import path from "path"

const bin = (() => {
	const home = os.homedir()
	const potentialPathsUnix = [
		"aseprite",
		path.join(home, "aseprite/build/bin/aseprite"),
		path.join(home, "aseprite/bin/aseprite"),
	]

	const potentialPathsWindows = [
		"aseprite",
		"D:\\apps\\Aseprite\\bin\\aseprite.exe",
	]

	const platform = process.platform

	if (platform == "win32") {
		for (const p of potentialPathsWindows) {
			try {
				const out = execFileSync("where", [p], { shell: true }).toString().trim().split(/\r?\n/)[0]

				if (out) {
					return p
				}
			}
			catch {}

			if (existsSync(p)) {
				return p
			}
		}
	}
	else {
		for (const p of potentialPathsUnix) {
			try {
				const out = execFileSync("which", [p], { shell: true }).toString().trim()
				if (out) {
					return p
				}
			}
			catch {}

			if (existsSync(p)) {
				return p
			}
		}
	}

	throw new Error("could not find aseprite path. Put your aseprite path in: Aseprite.js")
})()


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
		], { stdio: "inherit", shell: true })
	}

	static groups(srcFile, destBase) { // use this to extract groups from aseprite file. todo
		execFileSync(bin, [
			"-b",
			srcFile,
			"--list-layers",
			"--data",
			destBase + "Groups.json",
			"--format",
			"json-array",
		], { shell: true })
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
		], { shell: true })
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
		], { shell: true })
	}


	static tilemaps(srcFile) {
		execFileSync(bin, [
			"-b",
			srcFile,
			"--script",
			FileConfig.asepriteToJson,
		], { shell: true })
	}
}