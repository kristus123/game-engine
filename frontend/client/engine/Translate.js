import { pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2"

const translators = new Map()

async function getTranslator(source, target) {
	const key = `${source}-${target}`

	if (!translators.has(key)) {
		const model = await pipeline("translation", `Xenova/opus-mt-${source}-${target}`)
		translators.set(key, model)
	}

	return translators.get(key)
}

export async function Translate(source, target, text) {
	const translator = await getTranslator(source, target)
	const result = await translator(text)
	return result[0].translation_text
}

async function ToChinese(text) {
	return await translate("en", "zh", text)
}
