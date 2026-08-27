document.addEventListener("contextmenu", e => e.preventDefault());

SocketClient.connect(() => {
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


Promise.all([
	Promise.all(AssetPaths.htmlTemplate.map(LoadHtmlContent)),
	Promise.all(AssetPaths.htmlComponent.map(c => {
		WebComponent(c.name, c.content)
	}))
])


async function loadFont(name, url, element = document.documentElement) {
	const font = new FontFace(name, `url(${url})`);

	await font.load();
	document.fonts.add(font);

	element.style.fontFamily = name;
}

await loadFont("VT323", "https://fonts.gstatic.com/s/vt323/v17/pxiKyp0ihIEF2isQFJXUdVNF.woff2");

FindPair()
