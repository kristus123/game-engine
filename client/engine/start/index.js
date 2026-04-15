export const index = ""
import { initD1 } from "/client/engine/start/draw_layers/D1.js"
import { initD2 } from "/client/engine/start/draw_layers/D2.js"
import { initD3 } from "/client/engine/start/draw_layers/D3.js"

async function loadWorld() {
	const module = await import("/client/game/code/World.js")
	const World = module.World // access the exported member
	return World
}

navigator.serviceWorker.getRegistrations().then(r => r.forEach(sw => sw.unregister()))
if ("serviceWorker" in navigator) {
	// navigator.serviceWorker.register('/sw.js') // add this back when our sw is ready
}

async function loadAsepriteAssets(path) {

	// const fullImage = await LoadImage(`${path}.png`)
	// const fullJson = await LoadJson(`${path}.json`)

	const layersImage = await LoadImage(`${path}Layers.png`)
	const layersJson = await LoadJson(`${path}Layers.json`)

	// const tilemapsJson = await LoadJsonIfPresent(`${path}SpriteTilemapInfo.json`)

	const spriteName = path.split("/").pop()

	Sprite[spriteName] = (position) => new SpriteController(position, layersImage, layersJson)

	// if (tilemapsJson) {
	// 	SpriteTilemapInfo[spriteName] = (d, position, scale=1) => new SpriteTilemapInfoController(d, x, position, fullImage)
	// }
	// else {
	// 	SpriteTilemapInfo[spriteName] = () => {
	// 		throw new Error("This aseprite file does not have tilemap info")
	// 	}
	// }
}

async function loadHtmlContent(o) {
	// consider not using getter. i think that is the better approach
	Getter(F, o.name, () => {
		const template = document.createElement("template")
		template.innerHTML = o.content

		let div = null

		if (template.content.childElementCount === 0) {
			throw new Error(`loadHtmlContent: "${o.name}" has no top-level elements!`)
		}
		else if (template.content.childElementCount === 1) {
			div = template.content.firstElementChild
		}
		else {
			div = document.createElement("div")
			container.append(...template.content.children)
		}

		for (const e of div.querySelectorAll("[id]")) {
			Assert.notPresent(div[e.id]) // not the safest hack but it's ok. Getter adds it to the prototype
			div[e.id] = e
		}

		return div
	})
}

async function loadAllAudio() {
	return Promise.all(AUDIO_FILES.map(async path => {
		const audio = await LoadAudio(path)
		const key = path.split("/").pop().replace(".mp3", "")
		G.Sound[key] = audio
	}))
}

Promise.all([
	loadWorld(),
	Promise.all(ASEPRITE_FILES.map(loadAsepriteAssets)),
	Promise.all(HTML_CONTENTS.map(loadHtmlContent)),
	loadAllAudio(),
])
	.then((x) => {
		const mainPalette = Palette.main()

		Sound.init()
		Mouse.initialize()
		Controller.init()
		Camera.initialize()
		Mouse.initializeAfterCameraIsInitialized()

		initD1(Draw(mainPalette.ctx))

		Level.change(new x[0]())

		Loop.everyFrame(() => {
			// mainPalette.clear()
			mainPalette.fill("#10204f")

			Physics.update()

			Camera.applyPositionContextThing(mainPalette, () => {
				Controller.update()
				Level.update()
				Mouse.update()
			})
		})
	})
	.catch(e => {
		console.error(e)

		const err = e instanceof Error ? e : new Error(e)
		const lines = (err.stack || "").split("\n")

		Dom.swap(lines.map(line => Html.p(line)))

		throw err
	})


const process = (e) => {
	if (e.hasAttribute("offset-x")) {
		e.style.setProperty("--offset-x", e.getAttribute("offset-x"))
	}

	if (e.hasAttribute("offset-y")) {
		e.style.setProperty("--offset-y", e.getAttribute("offset-y"))
	}
}

const observer = new MutationObserver(mutations => {
	const nodes = []
	for (const mutation of mutations) {
		console.log(mutation)
		for (const n of mutation.addedNodes) {
			nodes.push(n)
		}
	}

	for (const node of nodes) {
		process(node)
		for (const subNode of node.querySelectorAll("[offset-x], [offset-y]")) {
			process(subNode)
		}
	}
})

observer.observe(document.body, { childList: true, subtree: true })
