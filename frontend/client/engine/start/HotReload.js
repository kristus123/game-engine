SocketClient.onServerMessage(EngineConstants.HOT_RELOAD, () => {
	Dom.overlay(H.p("RELOADING").css("color:white; font-size:150px;"))

	setTimeout(() => {
		location.reload()
	}, 20)
})