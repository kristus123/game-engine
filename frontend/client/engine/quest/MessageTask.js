export function MessageTask({messageText, onStart, markDoneIf, onDone} = {}) { // no-null-check
	return Task("Message Task", {
		start: () => {
			G.player.msg.set([H.p(messageText)])
			G.player.msg.show()
			onStart?.()
		},
		markDoneIf: markDoneIf,
		onDone: () => {
			G.player.msg.hide()
			onDone?.()
		}
	})
}
