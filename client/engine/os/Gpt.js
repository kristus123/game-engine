export async function Gpt(text) {
	const res = await fetch("https://api.openai.com/v1/responses", {
		method: "POST",
		headers: {
			Authorization: "Bearer YOUR_API_KEY_HERE",
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

	const reply = data.output_text

	console.log(reply)

	return reply
}
