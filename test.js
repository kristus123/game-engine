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

// Clean setup directory
fs.rmSync(SETUP_DIR, {
	recursive: true,
	force: true,
})

fs.mkdirSync(SETUP_DIR, {
	recursive: true,
})

// Ensure dist exists
if (!fs.existsSync(DIST_DIR)) {
	throw new Error("dist folder missing. Run build first.")
}

// Copy build output
fs.cpSync(
	DIST_DIR,
	path.join(SETUP_DIR, "dist"),
	{ recursive: true }
)

// Init Capacitor project
run("npm init -y", SETUP_DIR)

run("npm i @capacitor/core", SETUP_DIR)
run("npm i -D @capacitor/cli", SETUP_DIR)

run(
	"npx cap init MyApp com.example.myapp --web-dir=dist",
	SETUP_DIR
)

run("npm i @capacitor/android", SETUP_DIR)

run("npx cap add android", SETUP_DIR)

fs.writeFileSync(
	path.join(SETUP_DIR, "capacitor.config.json"),
	JSON.stringify(
		{
			appId: "com.example.myapp",
			appName: "MyApp",
			webDir: "dist",
			server: {
				// url: "http://192.168.10.65:5000",
				cleartext: true,
				allowNavigation: ['*'],
				host: true,
				port: 5000
			}
		},
		null, 4),
	"utf-8")

fs.writeFileSync(
	path.join(SETUP_DIR, "android/local.properties"),
	"sdk.dir=C\\:\\\\Users\\\\sadfa\\\\AppData\\\\Local\\\\Android\\\\Sdk",
	"utf-8")

// Sync Capacitor
run("npx cap sync", SETUP_DIR)

// Ensure android folder exists before writing gradle properties
const gradlePropsPath = path.join(
	SETUP_DIR,
	"android/gradle.properties"
)

fs.mkdirSync(path.dirname(gradlePropsPath), { recursive: true })

const JBR_PATH = "C:/Program Files/Android/Android Studio/jbr"
fs.appendFileSync(gradlePropsPath, `\norg.gradle.java.home=${JBR_PATH}\n`)

// Open Android Studio
// run("npx cap open android", SETUP_DIR)

run("npx cap run android --live-reload --port 5000", SETUP_DIR)
