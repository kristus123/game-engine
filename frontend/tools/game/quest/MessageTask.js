export function MessageTask({ text, onStart, markDoneIf, markDoneAfterMs, onDone } = {}) { // allow-null
	return Task("Message Task", {
		start: () => {
			G.player.msg.set([H.p(text)])
			G.player.msg.show()
			onStart?.()
		},
		markDoneIf: markDoneIf,
		markDoneAfterMs: markDoneAfterMs,
		onDone: () => {
			G.player.msg.hide()
			onDone?.()
		}
	})
}
