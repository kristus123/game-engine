export async function ToChinese(text) {
	return await Translate("en", "zh", text)
}
