const h = Html.settings()

h.navigateToPracticeCard.onClick(() => {
	Page.go(PracticePage)
})

Mic.all(m => {
	const label = m.label.replace(/\s*\([^()]*\)\s*$/, "")
	h.mid.add(H.button(label, () => {
		Mic.selected = m.deviceId
	}).css("padding:20px;"))
})

export const SettingsPage = Page.init(h)
