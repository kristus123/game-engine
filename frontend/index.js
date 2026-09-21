Log.sendConsoleToServer()

const backendId = LocalValue("backendId", -1)
SocketClient.onServerMessage("HOT_RELOAD_BACKEND_ID", (data) => {
	if (data.backendId > backendId.value) {
		backendId.value = data.backendId
		Dom.overlay(H.p("RELOADING").css("color:white; font-size:150px;"))
		location.reload()
	}
	else if (backendId.value > data.backendId) {
		backendId.value = 0
	}
})

SocketClient.connect(() => {
	SocketClient.sendToServer("HOT_RELOAD_BACKEND_ID", {})
})

ServiceWorker.init()

document.addEventListener("contextmenu", e => e.preventDefault())

InjectGlobalAttributeLogicToHtml()

await Promise.all([
	Token.init(),
	Promise.all(AssetPaths.htmlComponent
		.map(c => RegisterCustomWebComponent(c.name, c.content, c.js))
	),
	Font.load("VT323", "https://fonts.gstatic.com/s/vt323/v17/pxiKyp0ihIEF2isQFJXUdVNF.woff2"),
	Css.use("/swag.css"),
])

document.getElementById("initialSpin").remove()
Font.use("VT323")

// FindPair()
// Livestream()
PracticeLanguage()
// CodeEditor()
