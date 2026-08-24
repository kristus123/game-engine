SocketClient.connect(() => {
	console.log("connected")
})

SocketClient.onServerMessage("HOT_RELOAD", () => {
	Dom.overlay(H.p("RELOADING").css("color:white; font-size:150px;"))
	location.reload()
})

ServiceWorker.init()

HtmlObserverThing((node) => {

	//make it better later! currently only work with contenteditable
	if node.hasAttribute("prevent-default") {  
		node.addEventListener("keydown", (e) => {
			if (e.key == "Enter") {
	 		   e.preventDefault();
	 		}
		});
	}
})

// await ClientToken.init()

CanvasGame()
