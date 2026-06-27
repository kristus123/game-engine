import { execFileSync } from "child_process"
import { existsSync } from "fs"

import os from "os"
import path from "path"

export const AsepritePath = (() => {
	const home = os.homedir()
	const potentialPathsUnix = [
		"aseprite", // Kristian
		"/Applications/Aseprite.app/Contents/MacOS/aseprite", // Hakashi
		path.join(home, "aseprite/build/bin/aseprite"), // Windows - maybe one of them is redundant
		path.join(home, "aseprite/bin/aseprite"), // Windows - maybe one of them is redundant
		path.join(home, "Apps/AppData/Aseprite/bin/aseprite") // Nabir
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


