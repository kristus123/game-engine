export const HotReload = ""

const hotReloadConnection = new WebSocket(`${Config.wsUrl}?clientId=hotReload`)

hotReloadConnection.onopen = () => {
	console.log("HotReload socket connection opened")
}

hotReloadConnection.onmessage = event => {
	try {
		const data = JSON.parse(event.data)
		if (data?.action === EngineConstants.HOT_RELOAD) {
			Dom.overlay(H.p("RELOADING").css("color:white; font-size:150px;"))

			setTimeout(() => {
				location.reload()
			}, 20)
		}
	}
	catch (e) {
		console.error("HotReload error parsing socket message", e)
	}
}

hotReloadConnection.onclose = () => {
	console.warn("HotReload socket connection closed")
}

hotReloadConnection.onerror = () => {
	console.error("HotReload socket connection failed")
}
