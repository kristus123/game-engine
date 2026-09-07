export function Toast(text) {
	const t = Dom.add(`
		<overlay>
			<p class="bgWhite">${text}</p>
		</overlay>
	`.toHtml())
	t.div.text(text)
	setTimeout(() => {
		t.remove()
	}, 1_000)
}
