import assert from "node:assert/strict"
import { test } from "node:test"
import { readFileSync, mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"
import { TranspileContent } from "../transpiler/TranspileContent.js"

function assetCatalog(images) {
	const file = new URL("../../frontend/AssetPaths.js", import.meta.url)
	const source = readFileSync(file, "utf8")
		.replaceAll("IMAGE_FILES", JSON.stringify(images))
		.replace(/ASEPRITE_FILES|HTML_CONTENTS|CUSTOM_WEB_COMPONENTS|AUDIO_FILES/g, "[]")
	const generated = TranspileContent(file.pathname, source, [])
	const execute = new Function("SuperClass", "IfCondition", "Assert",
		generated.replace("export class", "class") + "\nreturn AssetPaths")
	return execute(class {}, { validate: Boolean }, { notNull: value => assert.notEqual(value, null) })
}

export function ImageSourceChecks() {
	test("image references find paths by exact name and extension through the source transpiler", () => {
		const assets = assetCatalog([
			"/animals/reindeer.png",
			"/animations/reindeer.gif",
			"/photos/aurora.JPG",
			"/photos/portrait.jpeg",
			"/pictures/name.with.dots.png",
		])
		assert.equal(assets.resolveImageSource("Png.reindeer"), "/animals/reindeer.png")
		assert.equal(assets.resolveImageSource("Gif.reindeer"), "/animations/reindeer.gif")
		assert.equal(assets.resolveImageSource("jPg.aurora"), "/photos/aurora.JPG")
		assert.equal(assets.resolveImageSource("Jpeg.portrait"), "/photos/portrait.jpeg")
		assert.equal(assets.resolveImageSource("Png.name.with.dots"), "/pictures/name.with.dots.png")
	})

	test("missing references and ambiguous filenames throw useful errors", () => {
		const assets = assetCatalog(["/one/reindeer.png", "/two/reindeer.png"])
		assert.throws(() => assets.resolveImageSource("Png.missing"), /Image not found: Png\.missing/)
		assert.throws(() => assets.resolveImageSource("Png.Reindeer"), /Image not found/)
		assert.throws(() => assets.resolveImageSource("Gif.reindeer"), /Image not found/)
		assert.throws(() => assets.resolveImageSource("Png."), /Image not found/)
		assert.throws(() => assets.resolveImageSource("Png.reindeer"), /Duplicate image name.*\/one\/reindeer\.png.*\/two\/reindeer\.png/)
	})

	test("ordinary image URLs are preserved", () => {
		const assets = assetCatalog([])
		for (const source of ["", "/images/reindeer.png", "images/reindeer.png", "https://example.com/reindeer.png", "data:image/png;base64,AA==", "blob:https://example.com/id"]) {
			assert.equal(assets.resolveImageSource(source), source)
		}
	})

	test("plain image catalogs contain path strings and separate image extensions", async () => {
		const folder = "../../frontend/tools/game/start/"
		const runtimeAssert = { notNull: value => assert.notEqual(value, null) }
		const catalogs = await Promise.all(["Png", "Gif", "Jpg", "Jpeg"].map(async name => {
			const module = await import(new URL(folder + "graphics/sprite/" + name + ".js", import.meta.url))
			return module[name]
		}))
		const loaderFile = new URL(folder + "LoadAllImages.js", import.meta.url)
		const loaderSource = TranspileContent(loaderFile.pathname, readFileSync(loaderFile, "utf8"), [])
		const paths = ["/one/reindeer.png", "/two/reindeer.gif", "/photos/aurora.JPG", "/photos/portrait.jpeg"]
		for (const order of [paths, [...paths].reverse()]) {
			const preloaded = []
			const loadImage = async path => {
				preloaded.push(path)
				return { src: "https://example.com" + path }
			}
			const loader = new Function("Png", "Gif", "Jpg", "Jpeg", "LoadImage", "Assert",
				loaderSource.replace("export ", "") + "\nreturn LoadAllImages")(...catalogs, loadImage, runtimeAssert)
			await loader(order)
			assert.deepEqual(preloaded, order)
			assert.equal(catalogs[0].reindeer, paths[0])
			assert.equal(catalogs[1].reindeer, paths[1])
			assert.equal(catalogs[2].aurora, paths[2])
			assert.equal(catalogs[3].portrait, paths[3])
			assert.equal(Object.getPrototypeOf(catalogs[0]), Object.prototype)
			assert.equal(catalogs[0].missing, undefined)
		}
	})

	test("filename validation rescans files and allows different image extensions", () => {
		const fixture = mkdtempSync(join(tmpdir(), "image-source-check-"))
		try {
			const validator = new URL("../asserts/AssertUniqueFileNames.js", import.meta.url).href
			const script = `
				import assert from "node:assert/strict"
				import { mkdirSync, writeFileSync, unlinkSync } from "node:fs"
				import { AssertUniqueFileNames } from ${JSON.stringify(validator)}
				for (const folder of ["frontend/one", "frontend/two", "backend", "shared"]) {
					mkdirSync(folder, { recursive: true })
				}
				writeFileSync("frontend/one/reindeer.png", "")
				writeFileSync("frontend/two/reindeer.gif", "")
				AssertUniqueFileNames()
				writeFileSync("frontend/two/reindeer.png", "")
				assert.throws(() => AssertUniqueFileNames(), /reindeer\\.png.*duplicate/)
				unlinkSync("frontend/two/reindeer.png")
				AssertUniqueFileNames()
			`
			const result = spawnSync(process.execPath, ["--input-type=module", "-e", script], { cwd: fixture, encoding: "utf8" })
			assert.equal(result.status, 0, result.stderr)
		}
		finally {
			rmSync(fixture, { recursive: true, force: true })
		}
	})
}

ImageSourceChecks()
