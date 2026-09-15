Log.sendConsoleToServer()

SocketClient.connect(() => {
	SocketClient.sendToServer("GET_BACKEND_VERSION", {})
})

let currentVersion = 0;

SocketClient.onServerMessage("HOT_RELOAD", () => {
	Dom.overlay(H.p("RELOADING").css("color:white; font-size:150px;"))
	location.reload()
})

SocketClient.onServerMessage("BACKEND_VERSION", data => {
	if (currentVersion < data.version) {
		currentVersion = data.version

		Dom.overlay(H.p("RELOADING").css("color:white; font-size:150px;"))
		location.reload()
	}
})

ServiceWorker.init()
document.addEventListener("contextmenu", e => e.preventDefault())

InjectGlobalAttributeLogicToHtml()

await Promise.all([
	// ClientToken.init(),
	Promise.all(AssetPaths.htmlComponent
		.map(c => RegisterCustomWebComponent(c.name, c.content, c.js))
	),
	Font.load("VT323", "https://fonts.gstatic.com/s/vt323/v17/pxiKyp0ihIEF2isQFJXUdVNF.woff2"),
	Css.use("/swag.css"),
])

document.getElementById("initialSpin").remove()
Font.use("VT323")

// FindPair()
Livestream()
// PracticeLanguage()
// CodeEditor()
