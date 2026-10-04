export function Toast(text) { // no-null-check
	const o = Dom.add(`
		<overlay-fixed>
			<p class="bgWhite">${text}</p>
		</overlay-fixed>
	`.toHtml())

	setTimeout(() => {
		o.remove()
	}, 1_000)
}
