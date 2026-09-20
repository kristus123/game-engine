export default async ({ html }) => {

	SocketClient.onClientMessage("NEW_CHAT_MESSAGE", data => {
		html.chatHistory.add(H.create("chat-line", {
			slots: {
				name: data.name,
				message: data.message,
			},
		}))

		Tts(data.message)
	})

	return {
		methods: {
			sendMessage: () => {
				const message = html.message.value
				html.message.clear()

				SocketClient.sendToAllClients("NEW_CHAT_MESSAGE", {
					name: "brukernavn",
					message: message,
				})
			},
		},
	}
}
