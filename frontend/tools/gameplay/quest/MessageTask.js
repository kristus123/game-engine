export function MessageTask({ text, onStart, markDoneIf, markDoneAfterMs, onDone } = {}) { // no-null-check
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
