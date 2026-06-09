export function Toast(text) {
	const t = Dom.add(Html.toast())
	t.div.text(text)
	setTimeout(() => {
		t.remove()
	}, 1224)
}