const from = "en"
const to = "zh-CN"


export async function MyTranslate(text) {
	const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`

	const response = await fetch(url)
	const data = await response.json()

	return data.responseData.translatedText
}
