import { execSync } from "child_process"
import { AllImports } from "#root/AllImports.js"

const {
	Files,
	Paths,
	GenerateBackend,
	AssertNoReservedKeywordsUsedInFileNames,
	AssertUniqueFileNames,
	FileWatcher,
	ExportAseprite,
	ServeDist
} = AllImports

try {
	execSync("./scripts/kill_ports.sh", { stdio: "inherit" }) // todo make a windows version as well
}
catch (e) {
	console.log(e)
	console.log("failed to kill ports. most likely because this is a windows pc")
}

GenerateBackend("DEVELOPMENT")

AssertUniqueFileNames()
AssertNoReservedKeywordsUsedInFileNames()

Files.deleteFolder(Paths.distFolder)

import { HotReloader } from "./HotReloader.js"

FileWatcher([Paths.sharedFolder, Paths.frontendFolder, Paths.backendFolder], [".js", ".aseprite", ".html", ".css"], {
	onAdd: async (path) => {
		if (path.includes(".aseprite")) {
			await ExportAseprite(path)
		}
		else if (path.includes("backend") || path.includes("shared")) {
			console.log("BACKEND CHANGED")
			generateDistAndReloadAll()
		}
		else {
			generateDistAndReloadFrontend()
		}
	},
	onChange: async (path) => {
		if (path.includes(".aseprite")) {
			await ExportAseprite(path)
		}
		else if (path.includes("backend") || path.includes("shared")) {
			console.log("BACKEND CHANGED")
			generateDistAndReloadAll()
		}
		else {
			generateDistAndReloadFrontend()
		}
	},
	onDelete: async (path) => {
		if (path.includes("backend") || path.includes("shared")) {
			console.log("BACKEND CHANGED")
			generateDistAndReloadAll()
		}
		else {
			generateDistAndReloadFrontend()
		}
	},
})

function generateDistAndReloadAll() {
	HotReloader.generateTranspiledBackend(async () => {
		await HotReloader.reloadBackend()

		generateDistAndReloadFrontend()
	})
}

function generateDistAndReloadFrontend() {
	HotReloader.generateDist(() => {
		HotReloader.reloadFrontend()
	})
}

HotReloader.generateDist()
HotReloader.reloadBackend()
ServeDist()
