import { execFile } from "child_process"
import { AllImports } from "#root/AllImports.js"
const { FileConfig, AsepritePath } = AllImports

function run(args) {
	return new Promise((resolve, reject) => {
		execFile(AsepritePath, args, { stdio: "inherit", shell: true }, (err) => {
			if (err) {
				reject(err)
			}
			else {
				resolve()
			}
		})
	})
}

export class Aseprite {
	static tags(srcFile, destBase) {
		return run([
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
		])
	}

	static groups(srcFile, destBase) {
		return run([
			"-b",
			srcFile,
			"--list-layers",
			"--data",
			destBase + "Groups.json",
			"--format",
			"json-array",
		])
	}

	static layers(srcFile, destBase) {
		return run([
			"-b",
			"--split-layers",
			srcFile,
			"--sheet",
			destBase + "Layers.png",
			"--data",
			destBase + "Layers.json",
			"--filename-format",
			"{layer}_{frame}_{tag}",
		])
	}

	static tilemaps(srcFile) {
		return run([
			"-b",
			srcFile,
			"--script",
			FileConfig.asepriteToJson,
		])
	}
}
