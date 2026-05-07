import fs from "fs"
import path from "path"
import { spawnSync } from "child_process"

const ROOT = process.cwd()

const SETUP_DIR = path.join(ROOT, "capacitor_setup")
const DIST_DIR = path.join(ROOT, "dist")

function run(command, cwd = process.cwd()) {
	console.log(`\n> ${command}`)

	const result = spawnSync(command, {
		cwd,
		stdio: "inherit",
		shell: true,
	})

	if (result.status !== 0) {
		throw new Error(`Command failed: ${command}`)
	}
}

fs.rmSync(SETUP_DIR, {
	recursive: true,
	force: true,
})

fs.mkdirSync(SETUP_DIR, {
	recursive: true,
})

if (!fs.existsSync(DIST_DIR)) {
  throw new Error("dist folder missing. Run build first.")
}

fs.cpSync(
	DIST_DIR,
	path.join(SETUP_DIR, "dist"),
	{
		recursive: true,
	}
)

run("npm init -y", SETUP_DIR)

run("npm i @capacitor/core", SETUP_DIR)
run("npm i -D @capacitor/cli", SETUP_DIR)

run(
	"npx cap init MyApp com.example.myapp --web-dir=dist",
	SETUP_DIR
)

run("npm i @capacitor/android", SETUP_DIR)

run("npx cap add android", SETUP_DIR)


const filePath = path.join(SETUP_DIR, "capacitor.config.json");
fs.writeFileSync(filePath, `
	{
	  "appId": "com.example.myapp",
	  "appName": "MyApp",
	  "webDir": "dist"
	}
`.trim(), "utf-8");

// Optional iOS support
// run("npm i @capacitor/ios", SETUP_DIR)
// run("npx cap add ios", SETUP_DIR)

run("npx cap sync", SETUP_DIR)

run("npx cap open android", SETUP_DIR)
