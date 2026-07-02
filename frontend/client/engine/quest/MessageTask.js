export function MessageTask({messageText, startAction, markDoneIf, onDone} = {}) { // no-null-check
	return new Task("Message Task", {
		start: () => {
			G.player.msg.set([H.p(messageText)])
			G.player.msg.show()
			startAction?.()
		},
		markDoneIf: markDoneIf,
		onDone: () => {
			G.player.msg.hide()
			onDone?.()
		}
	})
}
