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


export async function Ttv(text) {
	const res = await fetch("https://api.openai.com/v1/audio/speech", {
		method: "POST",
		headers: {
			Authorization: "Bearer YOUR_API_KEY_HERE",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: "gpt-4o-mini-tts",
			voice: "alloy",
			input: text,
			instructions: "Speak in Norwegian with a Norwegian accent."
		}),
	})

	if (!res.ok) {
		const err = await res.text()
		throw new Error("Speech generation failed: " + err)
	}

	const audioBlob = await res.blob()

	return audioBlob
}
