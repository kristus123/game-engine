let o = null

export function Toast(text) { // no-null-check
	o ??= Dom.add(`
		<overlay>
		</overlay>
	`.toHtml())

	o.add(`
		<p class="bgWhite">${text}</p>
	`.toHtml())

	setTimeout(() => {
		o.remove()
	}, 1_000)
}
