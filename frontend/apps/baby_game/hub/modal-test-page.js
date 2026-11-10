export default {
	page: { persistOnClose: false },
	fields: () => ({ onEscape: null }),
	onFirstDomAdd: ({ html }) => {
		html.modal.closeButton.onClick(() => Page.close())
		html.modal.backdrop.onClick(() => Page.close())
		html.fields.onEscape = event => {
			if event.key == "Escape" {
				Page.close()
			}
		}
	},
	onDomAdd: ({ html }) => document.addEventListener("keydown", html.fields.onEscape),
	onDomRemove: ({ html }) => document.removeEventListener("keydown", html.fields.onEscape),
}
