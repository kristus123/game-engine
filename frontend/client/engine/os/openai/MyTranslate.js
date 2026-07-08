const text = "Hello, how are you?"
const from = "en"
const to = "zh-CN"

const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`

export async function MyTranslate(text) {

	const response = await fetch(url)
	const data = await response.json()

	return data.responseData.translatedText
}
