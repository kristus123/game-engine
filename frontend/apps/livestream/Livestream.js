export class Livestream {

	static async start() {
		const html = Page.init(H.create("livestream-body", {
			slots: {
				test: "wow",
			},
			on: {
				wow: () => {
					console.log("wow")
				},
				startStream: async () => {
					html.videoOverlay.clearChildren()
					const video = H.streamVideo(await Stream.start())
					video.mirror()
					html.videoOverlay.add(video)

					html.start.hide()
					html.stop.show()
				},
				stopStream: async () => {
					html.videoOverlay.clearChildren()
					Stream.stop()
				},
				sendMessage: () => {
					const message = html.message.value
					html.message.clear()

					SocketClient.sendToAllClients("NEW_CHAT_MESSAGE", {
						name: "brukernavn",
						message: message,
					})
				},
			},
		}))

		SocketClient.onClientMessage("NEW_CHAT_MESSAGE", data => {
			html.chatHistory.add(H.create("chat-line", {
				slots: {
					name: data.name,
					message: data.message,
				},
			}))
		})

		Page.go(html)

		// !async function() {
		// 	await Sim.click(html.openChat)

		// 	await Sim.type(html.message, "hello")

		// 	await Sim.click(() => html.send)
		// 	await Sim.click(html.closeChat)
		// }()
	}

	update() {

	}
}
