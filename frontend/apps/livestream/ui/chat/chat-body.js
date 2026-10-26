export default {
	onFirstDomAdd: (html) => {
		Chat.onMessage(({ name, message }) => {
			html.chatHistory.add(H.create("chat-line", {
				slots: {
					name: name,
					message: message,
				},
			}))
		})
	},
	methods: {
		sendMessage: (html) => {
			const message = html.message.value
			Chat.sendMessage(message)
			html.message.clear()
		},
	},
}
