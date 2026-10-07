export async function Gpt(text) {
	const r = await fetch("https://api.openai.com/v1/responses", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${OpenAiToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: "gpt-5.3-codex",
			input: text,
			temperature: 0,
		}),
	})

	if (r.ok) {
		return (await r.json())
			.output[0]
			.content
			.find((c) => c.type == "output_text")
			.text
	}
	else {
		throw new Error("Chat request failed: " + await r.text())
	}
}
