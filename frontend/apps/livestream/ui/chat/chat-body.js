export default async ({ html }) => {

	Chat.onMessage(({ name, message }) => {
		html.chatHistory.add(H.create("chat-line", {
			slots: {
				name: name,
				message: message,
			},
		}))
	})

	return {
		methods: {
			sendMessage: () => {
				const message = html.message.value
				Chat.sendMessage(message)
				html.message.clear()
			},
		},
	}
}
