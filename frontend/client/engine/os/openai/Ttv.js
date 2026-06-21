const voices = [
	"alloy",
	"ash",
	"ballad",
	"coral",
	"echo",
	"fable",
	"onyx",
	"nova",
	"sage",
	"shimmer",
]


export async function Ttv(text, instructions) {
	const res = await fetch("https://api.openai.com/v1/audio/speech", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${OpenAiToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: "gpt-4o-mini-tts",
			voice: "alloy",
			input: text,
			instructions: instructions,
		}),
	})

	if (!res.ok) {
		const err = await res.text()
		throw new Error("Speech generation failed: " + err)
	}

	return await res.blob()
}
