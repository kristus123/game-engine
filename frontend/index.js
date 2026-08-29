function loadCss(path) {
	return new Promise((resolve, reject) => {
		const link = document.createElement("link")

		link.rel = "stylesheet"
		link.href = path

		link.onload = () => {
			console.log("css scucess")
			resolve()
		}
		link.onerror = () => {
			console.error("css error")
			reject()
		}

		document.head.appendChild(link)
	})
}


document.addEventListener("contextmenu", e => e.preventDefault())

SocketClient.connect(() => {
})

SocketClient.onServerMessage("HOT_RELOAD", () => {
	Dom.overlay(H.p("RELOADING").css("color:white; font-size:150px;"))
	location.reload()
})

ServiceWorker.init()

HtmlObserverThing((node) => {

	//make it better later! currently only work with contenteditable
	if (node.hasAttribute("prevent-default") && node.hasAttribute("contenteditable")) {
		node.addEventListener("keydown", (e) => {
			if (e.key == "Enter") {
	 		   e.preventDefault()
	 		}
		})
	}

	if (node.hasAttribute("hide-on-click")) {
		node.addEventListener("click", () => {
			node.hide()
		})
	}

	const onClickShow = node.getAttribute("on-click-show")
	if (onClickShow) {
		node.addEventListener("click", () => {
			const e = Assert.value(document.getElementById(onClickShow))
			e.show()
		})
	}

	const onClickHide = node.getAttribute("on-click-hide")
	if (onClickHide) {
		node.addEventListener("click", () => {
			const e = Assert.value(document.getElementById(onClickHide))
			e.hide()
		})
	}

})

// await ClientToken.init()

async function loadFont(name, url, element = document.documentElement) {
	const font = new FontFace(name, `url(${url})`)
	await font.load()
	document.fonts.add(font)
	return font
}

function applyFont(name, font, element = document.documentElement) {
	element.style.fontFamily = name
}

const font = loadFont("VT323", "https://fonts.gstatic.com/s/vt323/v17/pxiKyp0ihIEF2isQFJXUdVNF.woff2")

await Promise.all([
	Promise.all(AssetPaths.htmlTemplate.map(LoadHtmlContent)),
	Promise.all(AssetPaths.htmlComponent.map(c => {
		WebComponent(c.name, c.content)
	})),
	font,
	// loadCss("/swag.css"),
])

// setTimeout(async () => {
document.getElementById("initialSpin").remove()
applyFont("VT323", await font)

// FindPair()
Livestream()
// }, 2_000)
