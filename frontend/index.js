// Log.sendConsoleToServer()

const backendId = LocalValue("backendId", -1)

SocketClient.onServerMessage("HOT_RELOAD_BACKEND_ID", ({ data }) => {
	if (data.backendId > backendId.value) {
		backendId.value = data.backendId
		Dom.overlay(H.p("RELOADING").css("color:white; font-size:150px;"))
		location.reload()
	}
	else if (backendId.value > data.backendId) {
		backendId.value = 0
	}
})


// ServiceWorker.init()
ServiceWorker.unregister()

document.addEventListener("contextmenu", e => e.preventDefault())

InjectGlobalAttributeLogicToHtml()

await Promise.all([
	SocketClient.connect(),
	Token.init(),
	Promise.all(AssetPaths.htmlComponent
		.map(c => RegisterCustomWebComponent(c.name, c.content, c.js))
	),
	Font.load("VT323", "https://fonts.gstatic.com/s/vt323/v17/pxiKyp0ihIEF2isQFJXUdVNF.woff2"),
	Css.use("/swag.css"),

	// these are CanvasLoop CanvasGame stuff
	Promise.all(AssetPaths.aseprite.map(LoadAsepriteAssets)),
	LoadAllAudio(AssetPaths.audio),
	LoadAllImages(AssetPaths.image),
	// await LoadPersistedJson()
	// these are CanvasLoop CanvasGame stuff
])

document.getElementById("initialSpin").remove()
Font.use("VT323")

// this can be combined with index.html block thingy
let lastRatio = devicePixelRatio

setInterval(() => {
	if (devicePixelRatio != lastRatio) {
		lastRatio = devicePixelRatio
		console.log(devicePixelRatio)
	}
}, 250)

// FindPair()
Livestream()
// CanvasGame()
// PracticeLanguage()
// CodeEditor()
