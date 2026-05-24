const h = F.settings()

h.navigateToPracticeCard.onClick(() => {
	Page.go(PracticePage)
})

Microphone.all(m => {
	const label = m.label.replace(/\s*\([^()]*\)\s*$/, "")
	h.mid.add(Html.button(label, () => {
		Microphone.selected = m.deviceId
	}).css("padding:20px;"))
})

export const SettingsPage = Page.init(h)
