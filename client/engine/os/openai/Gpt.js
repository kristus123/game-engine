export async function Gpt(text) {
	const res = await fetch("https://api.openai.com/v1/responses", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${OpenAiToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: "gpt-4o",
			input: text,
		}),
	})

	if (!res.ok) {
		const err = await res.text()
		throw new Error("Chat request failed: " + err)
	}

	const data = await res.json()

	console.log(data)

	const reply = data.output[0].content.find((c) => c.type == "output_text").text

	return reply
}
