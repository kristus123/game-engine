export function PracticeLanguage() {
	Page.init("addCard", H.create("add-card"))

	Page.init("practice", H.create("practice-card"))

	Page.go("practice")
}

