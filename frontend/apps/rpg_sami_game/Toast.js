export function Toast(text) { // no-null-check
	const o = Dom.add(`
		<overlay>
			<p class="bgWhite">${text}</p>
		</overlay>
	`.toHtml())

	setTimeout(() => {
		o.remove()
	}, 1_000)
}
