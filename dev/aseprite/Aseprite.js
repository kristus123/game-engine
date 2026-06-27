import { execFileSync } from "child_process"
import { FileConfig } from "#root/FileConfig.js"
import { AsepritePath } from "#root/dev/aseprite/AsepritePath.js"

export class Aseprite {

	static tags(srcFile, destBase) {
		execFileSync(AsepritePath, [
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

	static groups(srcFile, destBase) {
		execFileSync(AsepritePath, [
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
		execFileSync(AsepritePath, [
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

	static tilemaps(srcFile) {
		execFileSync(AsepritePath, [
			"-b",
			srcFile,
			"--script",
			FileConfig.asepriteToJson,
		], { shell: true })
	}
}
