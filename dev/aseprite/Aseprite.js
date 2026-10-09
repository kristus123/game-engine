import { AsepritePath } from "#root/dev/aseprite/AsepritePath.js"
import { Paths, ChildProcess } from "#root/AllImports.js"

function run(args) {
	const child = new ChildProcess(AsepritePath, { args, group: "aseprite" }).start()
	return child.awaitFinish().then(({ code, signal }) => {
		if (code != 0 || signal != null) {
			throw new Error(`Aseprite process failed: code=${code}, signal=${signal}`)
		}
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
			Paths.asepriteToJson,
		])
	}
}
