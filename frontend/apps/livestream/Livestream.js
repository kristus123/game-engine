export class Livestream {

	static async start() {
		const html = Page.init("index", H.create("livestream-body"))

		SocketClient.onClientMessage("NEW_CHAT_MESSAGE", data => {
			html.chatHistory.add(H.create("chat-line", {
				slots: {
					name: data.name,
					message: data.message,
				},
			}))
		})

		Page.go("index")

		!async function() {
			await Sim.click(html.openChat)

			await Sim.type(html.message, "hello")

			await Sim.click(() => html.send)
			await Sim.click(html.closeChat)
		}()
	}

	update() {

	}
}
