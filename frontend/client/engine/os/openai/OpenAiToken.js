let token = localStorage.getItem("openaiToken")

if (token == null) {
	const value = prompt("Paste your openAI token")
	localStorage.setItem("openaiToken", value)
	token = value
}

export const OpenAiToken = token
