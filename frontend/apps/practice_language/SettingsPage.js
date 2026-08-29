const html = Html.settings()

html.navigateToPracticeCard.onClick(() => {
	Page.go(PracticePage)
})

AllMics.get(m => {
	const label = m.label.replace(/\s*\([^()]*\)\s*$/, "")
	html.mid.add(H.button(label, () => {
		Mic.selected = m.deviceId
	}).css("padding:20px;"))
})

export const SettingsPage = Page.init(html)
