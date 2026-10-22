export default async ({ html }) => {
	html.show = () => {
		html.hidden = false
		html.closeButton.focus()
	}

	html.closeButton.onClick(() => html.hidden = true)
	html.scrimButton.onClick(() => html.hidden = true)

	const onKeyDown = event => {
		if event.key == "Escape" && !html.hidden {
			html.hidden = true
		}
	}

	const addKeyListener = () => document.addEventListener("keydown", onKeyDown)
	const removeKeyListener = () => document.removeEventListener("keydown", onKeyDown)
	addKeyListener()

	return {
		onDomAdd: addKeyListener,
		onDomRemove: removeKeyListener,
	}
}
