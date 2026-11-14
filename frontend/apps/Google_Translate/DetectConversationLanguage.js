export function DetectConversationLanguage(text, languages) {
	// The newest script is evidence about the current speaker; counting an
	// accumulated paragraph lets a long earlier English turn dominate はい.
	const scripts = text.match(/[a-z]+|[\u3040-\u30ff]+|[\u3400-\u9fff]+/gi)
	const recent = scripts?.at(-1) || ""
	if /[\u3040-\u30ff]/.test(recent) && languages.includes("ja") {
		return "ja"
	}
	if /[\u3400-\u9fff]/.test(recent) {
		if languages.includes("ja") && languages.includes("zh") {
			return null
		}
		return languages.includes("zh") ? "zh" : "ja"
	}
	if /[a-z]/i.test(recent) && languages.includes("en") {
		return "en"
	}
	return null
}
