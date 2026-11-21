import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import Xml from "./Xml.js"

const repoDirectory = path.dirname(fileURLToPath(import.meta.url))
const projectsDirectory = path.join(repoDirectory, "ableton")
const outputXml = true
const audioExtension = "wav"

export const AbletonParser = (() => {
	return {
		prepareAssets: () => {
			const projects = {}
			const distAudioPaths = []

			for (const projectName of fs.readdirSync(projectsDirectory)) {
				const projectDirectory = path.join(projectsDirectory, projectName)
				if (!fs.statSync(projectDirectory).isDirectory()) {
					continue
				}
				const setPath = path.join(projectDirectory, `${projectName}.als`)
				if (!fs.existsSync(setPath)) {
					continue
				}
				const outputPath = outputXml ? path.join(projectDirectory, "output.xml") : null
				const xml = Xml.parseAls(setPath, outputPath)
				const bpm = Number(xml.find("Tempo").find("Manual").attributes.Value)

				const locators = xml.find("Locators").findAll("Locator")
					.map(locator => {
						const locatorName = locator.find("Name").attributes.Value
						const isArray = locatorName.endsWith("_array")
						return {
							name: isArray ? locatorName.slice(0, -"_array".length) : locatorName,
							isArray,
							time: Number(locator.find("Time").attributes.Value),
						}
					})
					.sort((first, second) => first.time - second.time)

				if (!Number.isFinite(bpm) || bpm <= 0) {
					throw new Error(`Invalid tempo in Ableton set: ${setPath}`)
				}
				if (locators.length == 0 || locators.some(locator => !locator.name || !Number.isFinite(locator.time))) {
					throw new Error(`No valid locators found in Ableton set: ${setPath}`)
				}
				const locatorNames = new Map()
				for (const locator of locators) {
					const previous = locatorNames.get(locator.name)
					if (previous && (!previous.isArray || !locator.isArray)) {
						throw new Error(`Duplicate Ableton locator name "${locator.name}" must use the _array suffix: ${setPath}`)
					}
					locatorNames.set(locator.name, locator)
				}

				const tracks = {}
				const exportedDirectory = path.join(projectDirectory, "exported")
				const exportedPrefix = `${projectName} `
				const exportedFiles = fs.existsSync(exportedDirectory) ? fs.readdirSync(exportedDirectory) : []
				for (const filename of exportedFiles) {
					const isMasterExport = filename == `${projectName}.${audioExtension}`
					if ((!isMasterExport && !filename.startsWith(exportedPrefix)) || !filename.endsWith(`.${audioExtension}`)) {
						continue
					}

					const trackName = isMasterExport
						? "master"
						: filename.slice(exportedPrefix.length, -(`.${audioExtension}`).length)
					const sourcePath = path.join(exportedDirectory, filename)

					const audioPath = `/ableton/${projectName}/${filename}`
					const distPath = path.join(repoDirectory, "dist", audioPath.slice(1))
					fs.mkdirSync(path.dirname(distPath), { recursive: true })
					fs.copyFileSync(sourcePath, distPath)
					distAudioPaths.push(audioPath)
					tracks[trackName] = { audioPath, locators }
				}
				projects[projectName] = { bpm, locators, tracks }
			}

			return { data: projects, audioPaths: distAudioPaths }
		},
	}
})()
