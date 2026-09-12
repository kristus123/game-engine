export function PracticeLanguage() {
	Page.init("addCard", H.create("add-card"))

	Page.init("practice", H.create("practice-card"))
	Page.init("settings", H.create("settings-page"))

	Page.go("practice")
}

