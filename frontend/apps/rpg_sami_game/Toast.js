export function Toast(text) { // allow-null
	const o = Dom.add(`
		<overlay-fixed>
			<p class="bgWhite">${text}</p>
		</overlay-fixed>
	`.toHtml())

	setTimeout(() => {
		o.remove()
	}, 1_000)
}
