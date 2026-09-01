import { pipeline } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3/dist/transformers.min.js"


(async () => {
	const chat = await pipeline(
		"text-generation",
		"onnx-community/Qwen2.5-0.5B-Instruct",
	)

	async function reply() {
		console.log("generating")
		const result = await chat(
			"What if you",
			{
				max_new_tokens: 28,
				do_sample: true,
				temperature: 0.8
			}
		)

		const r = result[0].generated_text

		const s = r.split(/\r?\n/)[0].beforePunctuation()

		console.log(s)
		// console.log(await ToChinese(s))
	}

	setInterval(async () => {
		reply()
	}, 500)




})()

export class ChineseCharacters {

}
